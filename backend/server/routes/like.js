const express = require('express');
const ApplicationLike = require('../models/ApplicationLike');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// GET /like/status - Get like status and total count
router.get("/status", async (req, res) => {
  try {
    const email = req.query.email;
    const token = req.headers.authorization?.split(' ')[1];

    let appLike = await ApplicationLike.findOne();
    
    if (!appLike) {
      appLike = await ApplicationLike.create({
        totalLikes: 0,
        likes: []
      });
    }

    let userLiked = false;
    
    if (email && token) {
      try {
        const user = await User.findOne({ where: { email } });
        if (user) {
          const likesArray = appLike.likes || [];
          userLiked = likesArray.some(like => like.userId === user.id);
        }
      } catch (error) {
        console.log("Token verification for like status skipped");
      }
    }

    res.send({
      success: true,
      totalLikes: appLike.totalLikes,
      userLiked
    });
  } catch (err) {
    res.status(500).send({ success: false, message: "Server error", error: err.message });
  }
});

// POST /like/toggle - Toggle like status
router.post("/toggle", verifyToken, async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Find or create application like document
    let appLike = await ApplicationLike.findOne();
    
    if (!appLike) {
      appLike = await ApplicationLike.create({
        totalLikes: 0,
        likes: []
      });
    }

    // Check if user already liked
    const likesArray = Array.isArray(appLike.likes) ? [...appLike.likes] : [];
    const existingLikeIndex = likesArray.findIndex(
      like => like.userId === user.id
    );

    if (existingLikeIndex > -1) {
      // User already liked, remove the like
      likesArray.splice(existingLikeIndex, 1);
      appLike.totalLikes = Math.max(0, appLike.totalLikes - 1);
    } else {
      // Add new like
      likesArray.push({
        userId: user.id,
        likedAt: new Date()
      });
      appLike.totalLikes += 1;
    }

    appLike.likes = likesArray;
    appLike.changed('likes', true);
    appLike.lastUpdated = new Date();
    await appLike.save();

    res.send({
      success: true,
      message: existingLikeIndex > -1 ? "Like removed" : "Like added",
      totalLikes: appLike.totalLikes,
      userLiked: existingLikeIndex === -1
    });
  } catch (err) {
    res.status(500).send({ success: false, message: "Server error", error: err.message });
  }
});

// GET /like/count - Get total likes count (public endpoint)
router.get("/count", async (req, res) => {
  try {
    let appLike = await ApplicationLike.findOne();
    
    if (!appLike) {
      appLike = await ApplicationLike.create({
        totalLikes: 0,
        likes: []
      });
    }

    res.send({
      success: true,
      totalLikes: appLike.totalLikes
    });
  } catch (err) {
    res.status(500).send({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
