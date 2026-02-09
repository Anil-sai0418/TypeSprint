const express = require('express');
const ContributionActivity = require('../models/ContributionActivity');
const verifyToken = require('../middleware/verifyToken');
const { getTodayDateString, getDateRange, isValidDateString, formatDateToString } = require('../utils/dateUtils');

const router = express.Router();

/**
 * POST /contribution/increment
 * Increment activity count for today
 * Called after a user completes a typing test
 */
router.post('/increment', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { email, metadata, activityType = 'typing_test' } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Get today's date
    const today = getTodayDateString();

    // Use upsert to avoid duplicates: increment if exists, create if doesn't
    const result = await ContributionActivity.findOneAndUpdate(
      {
        userId,
        date: today
      },
      {
        $set: {
          userId,
          email,
          date: today,
          activityType,
          ...(metadata && { metadata })
        },
        $inc: { activityCount: 1 }
      },
      {
        upsert: true,
        new: true,
        runValidators: false
      }
    );

    console.log(`✅ Contribution activity incremented for ${email} on ${today}`);

    return res.status(200).json({
      success: true,
      message: 'Activity incremented',
      data: {
        date: result.date,
        activityCount: result.activityCount
      }
    });
  } catch (error) {
    console.error('Error incrementing activity:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to increment activity'
    });
  }
});

/**
 * GET /contribution/activity
 * Fetch activity data for the last 365 days
 * Query params: days (default: 365)
 */
router.get('/activity', verifyToken, async (req, res) => {
  try {
    console.log('📊 GET /contribution/activity called');
    console.log('User:', req.user);
    const userId = req.user._id || req.user.id;
    const days = parseInt(req.query.days) || 365;
    console.log('Fetching activity for userId:', userId, 'days:', days);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    // Validate days parameter
    if (days < 1 || days > 730) {
      return res.status(400).json({
        success: false,
        message: 'Days must be between 1 and 730'
      });
    }

    // Get date range
    const { startDate, endDate } = getDateRange(days);

    // Query activities
    const activities = await ContributionActivity.find(
      {
        userId,
        date: {
          $gte: startDate,
          $lte: endDate
        }
      },
      { date: 1, activityCount: 1, activityType: 1, _id: 0 }
    )
    .sort({ date: 1 })
    .lean(); // Use lean() for read-only operations (faster)

    // Transform to activity map for frontend
    const activityMap = {};
    activities.forEach(activity => {
      activityMap[activity.date] = activity.activityCount;
    });

    return res.status(200).json({
      success: true,
      data: {
        activityMap,
        totalDays: activities.length,
        dateRange: { startDate, endDate }
      }
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch activity data'
    });
  }
});

/**
 * GET /contribution/stats
 * Get contribution statistics
 */
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    const { startDate, endDate } = getDateRange(365);

    // Get all activities for the period
    const activities = await ContributionActivity.find(
      {
        userId,
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }
    ).lean();

    // Calculate stats
    const totalActivities = activities.reduce((sum, a) => sum + a.activityCount, 0);
    const activeDAys = activities.length;
    const maxActivityDay = activities.length > 0 
      ? Math.max(...activities.map(a => a.activityCount))
      : 0;

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = formatDateToString(checkDate);
      
      const activity = activities.find(a => a.date === dateStr);
      if (activity && activity.activityCount > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        totalActivities,
        activeDAys,
        maxActivityDay,
        currentStreak,
        averagePerDay: activeDAys > 0 ? (totalActivities / activeDAys).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

/**
 * POST /contribution/set-activity
 * Manually set activity for a specific date (admin/debug)
 * In production, only allow for today's date
 */
router.post('/set-activity', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { email, date, activityCount } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    if (!email || !date || activityCount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Email, date, and activityCount are required'
      });
    }

    if (!isValidDateString(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    if (activityCount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Activity count cannot be negative'
      });
    }

    const result = await ContributionActivity.findOneAndUpdate(
      { userId, date },
      {
        $set: {
          userId,
          email,
          date,
          activityCount
        }
      },
      {
        upsert: true,
        new: true
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Activity set successfully',
      data: result
    });
  } catch (error) {
    console.error('Error setting activity:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to set activity'
    });
  }
});

module.exports = router;
