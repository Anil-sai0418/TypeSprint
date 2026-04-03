const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const admin = require('../config/firebase');
const { Op } = require('sequelize');
const moment = require('moment');

// Verification middleware for chron jobs
const verifyCronSecret = (req, res, next) => {
  const secret = req.headers['x-cron-secret'] || req.query['x-cron-secret'];
  if (!secret || secret !== process.env.CRON_SECRET) {
    console.warn(`[CRON] Unauthorized attempt to trigger streak-reminder from ${req.ip}`);
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

// Streak Reminder Endpoint
router.get('/streak-reminder', verifyCronSecret, async (req, res) => {
  try {
    console.log('[CRON] Running streak reminder job externally...');
    
    const now = moment();
    const twentyFourHoursAgo = moment().subtract(24, 'hours');
    const fortyEightHoursAgo = moment().subtract(48, 'hours');
    // To avoid spanning multiple notifications to the same person within a short time
    const twelveHoursAgo = moment().subtract(12, 'hours');

    // Find profiles with dailyStreak > 0, lastTestDate between 24 and 48 hours ago
    const profiles = await UserProfile.findAll({
      where: {
        dailyStreak: {
          [Op.gt]: 0
        },
        lastTestDate: {
          [Op.between]: [fortyEightHoursAgo.toDate(), twentyFourHoursAgo.toDate()]
        },
        [Op.or]: [
          { lastStreakReminder: null },
          { lastStreakReminder: { [Op.lt]: twelveHoursAgo.toDate() } }
        ]
      },
      include: [{
        model: User,
        as: 'User',
        where: {
          fcmToken: {
            [Op.not]: null,
            [Op.ne]: ''
          }
        },
        required: true
      }],
      limit: 500 // Batching to prevent timeout
    });

    let successCount = 0;
    let failureCount = 0;

    for (const profile of profiles) {
      const user = profile.User;
      
      const resetTime = moment(profile.lastTestDate).add(48, 'hours');
      const hoursRemaining = resetTime.diff(now, 'hours');
      const minutesRemaining = resetTime.diff(now, 'minutes') % 60;

      const timeText = hoursRemaining > 0 
        ? `${hoursRemaining} hours and ${minutesRemaining} minutes` 
        : `${minutesRemaining} minutes`;

      const message = {
        token: user.fcmToken,
        notification: {
          title: '🔥 Keep your streak alive!',
          body: `Continue your ${profile.dailyStreak}-day streak! It will reset in ${timeText}. Take a typing test now.`,
        },
        data: { action: 'open_app' }
      };

      try {
        await admin.messaging().send(message);
        console.log(`[CRON] Sent streak reminder to ${user.email}`);
        
        // Update last notified time
        profile.lastStreakReminder = now.toDate();
        await profile.save();
        successCount++;
      } catch (err) {
        console.error(`[CRON] Failed to send reminder to ${user.email}:`, err.message);
        failureCount++;
      }
    }

    console.log(`[CRON] Streak reminder job completed. Success: ${successCount}, Failed: ${failureCount}`);
    res.status(200).json({ 
      success: true, 
      message: `Processed ${profiles.length} reminders. Success: ${successCount}, Failed: ${failureCount}`
    });

  } catch (error) {
    console.error('[CRON] Error in streak-reminder endpoint:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Register Device Token
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ success: false, message: 'FCM Token is required' });
    }

    // First remove this token from any other users to prevent them from getting overlapping notifications
    await User.update(
      { fcmToken: null },
      { 
        where: { 
          fcmToken: token,
          id: { [Op.ne]: req.user.id }
        } 
      }
    );

    // Update user's FCM token in database
    await User.update(
      { fcmToken: token },
      { where: { id: req.user.id } }
    );

    res.status(200).json({ success: true, message: 'Push notification successfully registered' });
  } catch (error) {
    console.error('Error registering device token:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Send Push Notification (Single User)
// In production, this might be restricted to admin only
router.post('/send', verifyToken, async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;
    
    if (!admin.apps.length) {
      return res.status(500).json({ success: false, message: 'Firebase Admin not initialized' });
    }

    const targetUser = await User.findByPk(userId);
    if (!targetUser || !targetUser.fcmToken) {
      return res.status(404).json({ success: false, message: 'User or device token not found' });
    }

    const message = {
      notification: {
        title: title || 'New Notification',
        body: body || 'You have a new message'
      },
      data: data || {},
      token: targetUser.fcmToken
    };

    const response = await admin.messaging().send(message);
    res.status(200).json({ success: true, message: 'Notification sent successfully', response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Send Push Notification (All Users)
// In production, this MUST be restricted or carefully managed
router.post('/send-all', verifyToken, async (req, res) => {
    try {
        const { title, body, data } = req.body;

        if (!admin.apps.length) {
            return res.status(500).json({ success: false, message: 'Firebase Admin not initialized' });
        }

        const usersWithTokens = await User.findAll({
            where: {
                fcmToken: {
                    [require('sequelize').Op.ne]: null
                }
            },
            attributes: ['fcmToken']
        });

        const tokens = usersWithTokens.map(user => user.fcmToken);

        if (tokens.length === 0) {
             return res.status(404).json({ success: false, message: 'No devices registered for notifications' });
        }

        const message = {
            notification: {
                title: title || 'New Notification',
                body: body || 'You have a new message'
            },
             data: data || {},
            tokens: tokens
        };

        const response = await admin.messaging().sendEachForMulticast(message);
        res.status(200).json({ 
            success: true, 
            message: `Notification sent. Success: ${response.successCount}, Failed: ${response.failureCount}`, 
            responses: response.responses 
        });

    } catch (error) {
         console.error('Error sending multicast notification:', error);
         res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;