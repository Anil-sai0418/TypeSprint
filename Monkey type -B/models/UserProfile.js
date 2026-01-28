const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
    unique: true
  },
  phone: String,
  address: String,
  profileImage: String,
  
  // Typing Statistics
  highestSpeed: {
    type: Number,
    default: 0
  },
  bestTest: {
    type: Number,
    default: 0
  },
  totalTests: {
    type: Number,
    default: 0
  },
  dailyStreak: {
    type: Number,
    default: 0
  },
  averageSpeed: {
    type: Number,
    default: 0
  },
  
  // Activity tracking for heatmap (like LeetCode)
  // Structure: { "2026-01-15": 5, "2026-01-16": 3, ... }
  // where key is date in YYYY-MM-DD format and value is number of tests
  activityMap: {
    type: Map,
    of: Number,
    default: new Map()
  },
  
  // Typing tests history
  typingTests: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      wpm: Number,
      accuracy: Number,
      duration: Number,
      raw: Number
    }
  ],
  
  achievements: {
    type: [String],
    default: ["First Test"]
  },
  
  lastTestDate: Date
}, { timestamps: true });

module.exports = mongoose.model("userProfiles", userProfileSchema);
