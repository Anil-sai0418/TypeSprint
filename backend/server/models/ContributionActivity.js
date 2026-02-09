const mongoose = require('mongoose');

/**
 * ContributionActivity Schema
 * Tracks user activity on a per-day basis for the contribution graph
 * Uses date-based indexing for efficient queries
 */
const contributionActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  email: {
    type: String,
    required: true,
    index: true
  },
  // Date in YYYY-MM-DD format (stored as string for easy query and grouping)
  date: {
    type: String,
    required: true,
    index: true
  },
  // Count of activities on this date
  activityCount: {
    type: Number,
    default: 0,
    min: 0
  },
  // Activity type (e.g., 'typing_test', 'practice', etc.)
  activityType: {
    type: String,
    enum: ['typing_test', 'practice', 'challenge'],
    default: 'typing_test'
  },
  // Timezone of the user for accurate date recording
  timezone: {
    type: String,
    default: 'UTC'
  },
  // Metadata for activity (e.g., WPM, accuracy)
  metadata: {
    wpm: Number,
    accuracy: Number,
    duration: Number
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: () => new Date(),
    index: true
  },
  updatedAt: {
    type: Date,
    default: () => new Date()
  }
}, { 
  timestamps: false,
  collection: 'contribution_activities'
});

// Compound index for efficient queries: (userId, date) and (email, date)
contributionActivitySchema.index({ userId: 1, date: -1 });
contributionActivitySchema.index({ email: 1, date: -1 });

// Index for date range queries
contributionActivitySchema.index({ date: -1 });

module.exports = mongoose.model('ContributionActivity', contributionActivitySchema);
