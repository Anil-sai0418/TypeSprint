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

    let appLike = await ApplicationLike.findOne({});
    
    if (!appLike) {
      appLike = new ApplicationLike({
        totalLikes: 0,
        likes: []
      });
      await appLike.save();
    }

    let userLiked = false;
    
    if (email && token) {
      try {
        const user = await User.findOne({ email });
        if (user) {
          userLiked = appLike.likes.some(like => like.userId.toString() === user._id.toString());
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Find or create application like document
    let appLike = await ApplicationLike.findOne({});
    
    if (!appLike) {
      appLike = new ApplicationLike({
        totalLikes: 0,
        likes: []
      });
    }

    // Check if user already liked
    const existingLikeIndex = appLike.likes.findIndex(
      like => like.userId.toString() === user._id.toString()
    );

    if (existingLikeIndex > -1) {
      // User already liked, remove the like
      appLike.likes.splice(existingLikeIndex, 1);
      appLike.totalLikes = Math.max(0, appLike.totalLikes - 1);
    } else {
      // Add new like
      appLike.likes.push({
        userId: user._id,
        likedAt: new Date()
      });
      appLike.totalLikes += 1;
    }

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
    let appLike = await ApplicationLike.findOne({});
    
    if (!appLike) {
      appLike = new ApplicationLike({
        totalLikes: 0,
        likes: []
      });
      await appLike.save();
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
