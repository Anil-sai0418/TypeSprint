const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  likedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const applicationLikeSchema = new mongoose.Schema({
  totalLikes: {
    type: Number,
    default: 0
  },
  likes: [likeSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("applicationLikes", applicationLikeSchema);
