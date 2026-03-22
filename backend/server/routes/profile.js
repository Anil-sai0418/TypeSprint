const express = require('express');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// GET /profile/leaderboard/global/top - Get top typists (public endpoint - MUST BE BEFORE /:email)
router.get("/leaderboard/global/top", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get all users
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'createdAt'] });
    
    let leaderboardData = await Promise.all(
      users.map(async (user) => {
        const profile = await UserProfile.findOne({ where: { userId: user.id } });
        return {
          userId: user.id,
          name: user.name,
          email: user.email,
          profileImage: profile?.profileImage || null,
          peakWpm: profile?.highestSpeed || 0,
          avgWpm: profile?.averageSpeed || 0,
          totalTests: profile?.totalTests || 0,
          streak: profile?.dailyStreak || 0,
          accuracy: profile?.highestAccuracy || 0,
          lastTestDate: profile?.lastTestDate || null,
          phone: profile?.phone || null,
          location: profile?.address || null
        };
      })
    );

    // Filter out users with no tests
    const activeUsers = leaderboardData.filter(user => user.totalTests > 0);

    // Sort by Peak WPM (highest speed) descending, then by total tests, then by average WPM
    activeUsers.sort((a, b) => {
      if (b.peakWpm !== a.peakWpm) {
        return b.peakWpm - a.peakWpm;
      }
      if (b.totalTests !== a.totalTests) {
        return b.totalTests - a.totalTests;
      }
      return b.avgWpm - a.avgWpm;
    });

    // Add rank and limit results
    const rankedData = activeUsers.slice(0, limit).map((player, index) => ({
      rank: index + 1,
      ...player
    }));

    res.send({
      success: true,
      leaderboard: rankedData,
      total: activeUsers.length
    });
  } catch (err) {
    res.status(500).send({ success: false, message: "Server error", error: err.message });
  }
});

// GET /profile/:email - Get user profile by email
router.get("/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Find or create profile
    let profile = await UserProfile.findOne({ where: { userId: user.id } });
    if (!profile) {
      profile = await UserProfile.create({
        userId: user.id,
        achievements: ["First Test"]
      });
    }

    res.send({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      profile: profile
    });
  } catch (err) {
    res.status(500).send({ success: false, message: "Server error", error: err.message });
  }
});

// PUT /profile/:email - Update user profile
router.put("/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    const { phone, address, profileImage } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Update or create profile
    let profile = await UserProfile.findOne({ where: { userId: user.id } });
    if (profile) {
      await profile.update({ phone, address, profileImage });
    } else {
      profile = await UserProfile.create({
        userId: user.id,
        phone,
        address,
        profileImage
      });
    }

    res.send({
      success: true,
      message: "Profile updated successfully",
      profile: profile
    });
  } catch (err) {
    res.status(500).send({ success: false, message: "Server error", error: err.message });
  }
});

// GET /profile/:email/stats - Get user statistics
router.get("/:email/stats", verifyToken, async (req, res) => {
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
        highestAccuracy: profile.highestAccuracy || 0,
        bestTest: profile.bestTest || 0,
        totalTests: profile.totalTests || 0,
        averageSpeed: profile.averageSpeed || 0,
        dailyStreak: profile.dailyStreak || 0,
        achievements: profile.achievements || [],
        typingTests: profile.typingTests || []
      }
    });
  } catch (err) {
    res.status(500).send({ success: false, message: "Server error", error: err.message });
  }
});

// GET /profile/:email/activity - Get activity map for heatmap (LeetCode style)
router.get("/:email/activity", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Get profile with activity
    const profile = await UserProfile.findOne({ where: { userId: user.id } });
    if (!profile) {
      return res.send({
        success: true,
        activityMap: {}
      });
    }

    res.send({
      success: true,
      activityMap: profile.activityMap || {}
    });
  } catch (err) {
    res.status(500).send({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
