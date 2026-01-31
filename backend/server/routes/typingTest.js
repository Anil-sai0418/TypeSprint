const express = require('express');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Get or create profile
    let profile = await UserProfile.findOne({ userId: user._id });
    if (!profile) {
      profile = new UserProfile({
        userId: user._id,
        achievements: ["First Test"],
        highestSpeed: 0,
        averageSpeed: 0,
        totalTests: 0,
        dailyStreak: 0,
        bestTest: 0,
        typingTests: [],
        activityMap: new Map()
      });
    }

    // Add test to history
    const testDate = new Date();
    profile.typingTests.push({
      date: testDate,
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy),
      duration: duration,
      raw: raw || Math.round(wpm)
    });

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

    // Update average speed
    const totalWpm = profile.typingTests.reduce((sum, test) => sum + test.wpm, 0);
    profile.averageSpeed = Math.round(totalWpm / profile.typingTests.length);

    // Update activity map (LeetCode style heatmap)
    const dateKey = testDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    const currentActivity = profile.activityMap.get(dateKey) || 0;
    profile.activityMap.set(dateKey, currentActivity + 1);

    // Update daily streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayKey = today.toISOString().split('T')[0];
    const yesterdayKey = yesterday.toISOString().split('T')[0];

    if (profile.activityMap.has(todayKey)) {
      // User tested today, maintain or increment streak
      if (profile.activityMap.has(yesterdayKey)) {
        profile.dailyStreak = (profile.dailyStreak || 1) + 1;
      } else {
        profile.dailyStreak = 1;
      }
    }

    // Check achievements
    if (profile.highestSpeed >= 100 && !profile.achievements.includes("100 WPM Club")) {
      profile.achievements.push("100 WPM Club");
    }
    if (profile.highestSpeed >= 150 && !profile.achievements.includes("150 WPM Club")) {
      profile.achievements.push("150 WPM Club");
    }
    if (profile.dailyStreak >= 7 && !profile.achievements.includes("7-Day Streak")) {
      profile.achievements.push("7-Day Streak");
    }
    if (profile.totalTests >= 10 && !profile.achievements.includes("Speed Improver")) {
      profile.achievements.push("Speed Improver");
    }

    // Save profile
    await profile.save();

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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Get profile
    const profile = await UserProfile.findOne({ userId: user._id });
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
