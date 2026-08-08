const express = require('express');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

const { Op } = require('sequelize');

// GET /profile/leaderboard/global/top - Get top typists (public endpoint - MUST BE BEFORE /:email)
router.get("/leaderboard/global/top", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const search = (req.query.search || '').trim();
    const sortBy = req.query.sortBy || 'peak';
    const order = (req.query.order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const whereClause = {
      totalTests: { [Op.gt]: 0 }
    };

    const searchOp = Op.iLike || Op.like;
    const userWhereClause = search ? {
      [Op.or]: [
        { name: { [searchOp]: `%${search}%` } },
        { email: { [searchOp]: `%${search}%` } }
      ]
    } : undefined;

    let orderClause = [];
    if (sortBy === 'avg') {
      orderClause = [
        ['averageSpeed', order],
        ['highestSpeed', 'DESC'],
        ['totalTests', 'DESC']
      ];
    } else if (sortBy === 'accuracy') {
      orderClause = [
        ['highestAccuracy', order],
        ['highestSpeed', 'DESC'],
        ['totalTests', 'DESC']
      ];
    } else if (sortBy === 'streak') {
      orderClause = [
        ['dailyStreak', order],
        ['highestSpeed', 'DESC'],
        ['totalTests', 'DESC']
      ];
    } else if (sortBy === 'tests') {
      orderClause = [
        ['totalTests', order],
        ['highestSpeed', 'DESC']
      ];
    } else {
      // Default: peak
      orderClause = [
        ['highestSpeed', order],
        ['totalTests', 'DESC'],
        ['averageSpeed', 'DESC']
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await UserProfile.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'createdAt'],
          where: userWhereClause,
          required: true
        }
      ],
      order: orderClause,
      limit: limit,
      offset: offset
    });

    const rankedData = rows.map((profile, index) => {
      const user = profile.User || {};
      return {
        rank: offset + index + 1,
        userId: user.id,
        name: user.name,
        email: user.email,
        profileImage: profile.profileImage || null,
        peakWpm: profile.highestSpeed || 0,
        avgWpm: profile.averageSpeed || 0,
        totalTests: profile.totalTests || 0,
        streak: profile.dailyStreak || 0,
        accuracy: profile.highestAccuracy || 0,
        lastTestDate: profile.lastTestDate || null,
        phone: profile.phone || null,
        location: profile.address || null
      };
    });

    res.send({
      success: true,
      leaderboard: rankedData,
      total: count,
      page: page,
      limit: limit,
      totalPages: Math.ceil(count / limit) || 1
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
