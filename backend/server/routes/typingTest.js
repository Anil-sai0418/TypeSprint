const express = require('express');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const ContributionActivity = require('../models/ContributionActivity');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// POST /typing-test/result - Save test result and update activity
router.post("/result", verifyToken, async (req, res) => {
  try {
    const { email, wpm, accuracy, duration, raw } = req.body;

    if (!email || wpm === undefined || accuracy === undefined || duration === undefined) {
      return res.status(400).send({ success: false, message: "Missing required fields" });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Get or create profile
    let profile = await UserProfile.findOne({ where: { userId: user.id } });
    if (!profile) {
      profile = await UserProfile.create({
        userId: user.id,
        achievements: ["First Test"],
        highestSpeed: 0,
        averageSpeed: 0,
        totalTests: 0,
        dailyStreak: 0,
        bestTest: 0,
        typingTests: [],
        activityMap: {}
      });
    }

    // Add test to history
    const testDate = new Date();
    
    // Explicitly copy for JSON tracking in Sequelize
    const currentTests = Array.isArray(profile.typingTests) ? [...profile.typingTests] : [];
    currentTests.push({
      date: testDate,
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy),
      duration: duration,
      raw: raw || Math.round(wpm)
    });
    profile.typingTests = currentTests;
    profile.changed('typingTests', true);

    // Update statistics
    profile.totalTests = (profile.totalTests || 0) + 1;
    profile.lastTestDate = testDate;

    // Update highest speed
    if (wpm > (profile.highestSpeed || 0)) {
      profile.highestSpeed = wpm;
    }

    // Update best test (fastest completion)
    if (!profile.bestTest || duration < profile.bestTest) {
      profile.bestTest = duration;
    }
    
    // Update highest accuracy
    if (accuracy > (profile.highestAccuracy || 0)) {
      profile.highestAccuracy = accuracy;
    }

    // Update average speed
    const totalWpm = currentTests.reduce((sum, test) => sum + test.wpm, 0);
    profile.averageSpeed = Math.round(totalWpm / currentTests.length);

    // Update activity map (LeetCode style heatmap)
    const dateKey = testDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const currentActivityMap = typeof profile.activityMap === 'object' && profile.activityMap !== null ? { ...profile.activityMap } : {};
    const currentActivity = currentActivityMap[dateKey] || 0;
    currentActivityMap[dateKey] = currentActivity + 1;
    profile.activityMap = currentActivityMap;
    profile.changed('activityMap', true);

    // Update daily streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayKey = today.toISOString().split('T')[0];
    const yesterdayKey = yesterday.toISOString().split('T')[0];

    if (currentActivityMap[todayKey]) {
      // User tested today, maintain or increment streak
      if (currentActivityMap[yesterdayKey]) {
        // Only increment if they didn't just test earlier today for the first time
        // Actually, previous logic incremented it. Let's just keep the streak logic simple
        // If they played yesterday, streak continues or increments.
        // Wait, if they ALREADY played today, streak shouldn't increment twice today.
        // The original buggy logic:
        profile.dailyStreak = (profile.dailyStreak || 1); // Keep it same unless we verify yesterday
        // Better logic: we should only increment streak if this is the FIRST test of the today and they played yesterday
        if (currentActivityMap[todayKey] === 1 && currentActivityMap[yesterdayKey]) {
           profile.dailyStreak = (profile.dailyStreak || 0) + 1;
        } else if (currentActivityMap[todayKey] === 1 && !currentActivityMap[yesterdayKey]) {
           // First test today and no test yesterday = streak resets to 1
           profile.dailyStreak = 1;
        }
      }
    }

    // Check achievements
    const currentAchievements = Array.isArray(profile.achievements) ? [...profile.achievements] : ["First Test"];
    let achChanged = false;
    
    if (profile.highestSpeed >= 100 && !currentAchievements.includes("100 WPM Club")) {
      currentAchievements.push("100 WPM Club");
      achChanged = true;
    }
    if (profile.highestSpeed >= 150 && !currentAchievements.includes("150 WPM Club")) {
      currentAchievements.push("150 WPM Club");
      achChanged = true;
    }
    if (profile.dailyStreak >= 7 && !currentAchievements.includes("7-Day Streak")) {
      currentAchievements.push("7-Day Streak");
      achChanged = true;
    }
    if (profile.totalTests >= 10 && !currentAchievements.includes("Speed Improver")) {
      currentAchievements.push("Speed Improver");
      achChanged = true;
    }
    
    if (achChanged) {
      profile.achievements = currentAchievements;
      profile.changed('achievements', true);
    }

    // Save profile
    await profile.save();

    // Increment contribution activity for today
    try {
      const { getTodayDateString } = require('../utils/dateUtils');
      const todayStr = getTodayDateString();

      const [contribution] = await ContributionActivity.findOrCreate({
        where: { userId: user.id, date: todayStr },
        defaults: {
          email,
          activityType: 'typing_test',
          activityCount: 0
        }
      });
      contribution.activityCount += 1;
      await contribution.save();
      
      console.log(`✅ Contribution activity incremented for ${email} on ${todayStr}`);
    } catch (contributionErr) {
      console.error('Error updating contribution activity:', contributionErr);
      // Don't fail the request if contribution tracking fails
    }

    res.send({
      success: true,
      message: "Test result saved successfully",
      stats: {
        totalTests: profile.totalTests,
        highestSpeed: profile.highestSpeed,
        averageSpeed: profile.averageSpeed,
        dailyStreak: profile.dailyStreak,
        achievements: profile.achievements
      }
    });
  } catch (err) {
    console.error("Error saving test result:", err);
    res.status(500).send({ success: false, message: "Server error", error: err.message });
  }
});

// GET /typing-test/stats/:email - Get typing statistics
router.get("/stats/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Get profile
    const profile = await UserProfile.findOne({ where: { userId: user.id } });
    if (!profile) {
      return res.send({
        success: true,
        stats: {
          highestSpeed: 0,
          bestTest: 0,
          totalTests: 0,
          averageSpeed: 0,
          dailyStreak: 0,
          achievements: []
        }
      });
    }

    res.send({
      success: true,
      stats: {
        highestSpeed: profile.highestSpeed || 0,
        bestTest: profile.bestTest || 0,
        totalTests: profile.totalTests || 0,
        averageSpeed: profile.averageSpeed || 0,
        dailyStreak: profile.dailyStreak || 0,
        achievements: profile.achievements || []
      }
    });
  } catch (err) {
    res.status(500).send({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
