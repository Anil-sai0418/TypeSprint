const cron = require('node-cron');
const { Op } = require('sequelize');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const admin = require('../config/firebase'); // assuming firebase is configured as `admin`
const moment = require('moment');

// Function to send streak reminder
const sendStreakReminders = async () => {
  try {
    console.log('Running streak reminder job...');
    
    // We want users who took a test yesterday but not today
    // For streak to break, they must have missed a day (or close to missing)
    const now = moment();
    const twentyFourHoursAgo = moment().subtract(24, 'hours');
    const fortyEightHoursAgo = moment().subtract(48, 'hours');

    // Find profiles with dailyStreak > 0 and lastTestDate between 24 and 48 hours ago
    const profiles = await UserProfile.findAll({
      where: {
        dailyStreak: {
          [Op.gt]: 0
        },
        lastTestDate: {
          [Op.between]: [fortyEightHoursAgo.toDate(), twentyFourHoursAgo.toDate()]
        }
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
      }]
    });

    for (const profile of profiles) {
      const user = profile.User; // user instance
      
      // Calculate remaining time before streak reset
      // Assuming streak needs to be updated within 48h since last test
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
        data: {
          action: 'open_app'
        }
      };

      try {
        await admin.messaging().send(message);
        console.log(`Sent streak reminder to ${user.email}`);
      } catch (err) {
        console.error(`Failed to send reminder to ${user.email}:`, err);
      }
    }
    console.log('Streak reminder job completed.');
  } catch (error) {
    console.error('Error in sendStreakReminders job:', error);
  }
};

// Run every hour
// '0 * * * *' runs at minute 0 of every hour
exports.initJob = () => {
    cron.schedule('0 * * * *', sendStreakReminders);
    console.log('Streak notification job initialized.');
};

exports.sendStreakReminders = sendStreakReminders;
