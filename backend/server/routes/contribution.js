const express = require('express');
const { Op } = require('sequelize');
const ContributionActivity = require('../models/ContributionActivity');
const verifyToken = require('../middleware/verifyToken');
const { getTodayDateString, getDateRange, isValidDateString, formatDateToString } = require('../utils/dateUtils');

const router = express.Router();

/**
 * POST /contribution/increment
 */
router.post('/increment', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { email, metadata, activityType = 'typing_test' } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID not found in token' });
    }
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const today = getTodayDateString();

    const [activity] = await ContributionActivity.findOrCreate({
      where: { userId, date: today },
      defaults: {
        email,
        activityType,
        metadata: metadata || {},
        activityCount: 0
      }
    });

    activity.activityCount += 1;
    if (metadata) {
      activity.metadata = metadata;
      activity.changed('metadata', true);
    }
    await activity.save();

    console.log(`✅ Contribution activity incremented for ${email} on ${today}`);

    return res.status(200).json({
      success: true,
      message: 'Activity incremented',
      data: {
        date: activity.date,
        activityCount: activity.activityCount
      }
    });
  } catch (error) {
    console.error('Error incrementing activity:', error);
    return res.status(500).json({ success: false, message: 'Failed to increment activity' });
  }
});

/**
 * GET /contribution/activity
 */
router.get('/activity', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const days = parseInt(req.query.days) || 365;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID not found in token' });
    }
    if (days < 1 || days > 730) {
      return res.status(400).json({ success: false, message: 'Days must be between 1 and 730' });
    }

    const { startDate, endDate } = getDateRange(days);

    const activities = await ContributionActivity.findAll({
      where: {
        userId,
        date: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      },
      attributes: ['date', 'activityCount', 'activityType'],
      order: [['date', 'ASC']]
    });

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
    return res.status(500).json({ success: false, message: 'Failed to fetch activity data' });
  }
});

/**
 * GET /contribution/stats
 */
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID not found in token' });
    }

    const { startDate, endDate } = getDateRange(365);

    const activities = await ContributionActivity.findAll({
      where: {
        userId,
        date: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      }
    });

    const totalActivities = activities.reduce((sum, a) => sum + a.activityCount, 0);
    const activeDAys = activities.length;
    const maxActivityDay = activities.length > 0 
      ? Math.max(...activities.map(a => a.activityCount))
      : 0;

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
    return res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

/**
 * POST /contribution/set-activity
 */
router.post('/set-activity', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { email, date, activityCount } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID not found in token' });
    }
    if (!email || !date || activityCount === undefined) {
      return res.status(400).json({ success: false, message: 'Email, date, and activityCount are required' });
    }
    if (!isValidDateString(date)) {
      return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' });
    }
    if (activityCount < 0) {
      return res.status(400).json({ success: false, message: 'Activity count cannot be negative' });
    }

    const [activity, created] = await ContributionActivity.findOrCreate({
      where: { userId, date },
      defaults: {
        email,
        activityCount
      }
    });

    if (!created) {
      activity.activityCount = activityCount;
      activity.email = email;
      await activity.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Activity set successfully',
      data: activity
    });
  } catch (error) {
    console.error('Error setting activity:', error);
    return res.status(500).json({ success: false, message: 'Failed to set activity' });
  }
});

module.exports = router;
