import { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';

/**
 * Manual notification hook for testing
 * Access via: window.testNotification()
 */
export const useManualNotification = () => {
  const { addNotification, notifications } = useNotification();

  useEffect(() => {
    // Expose testing function globally
    window.testNotification = () => {
      const types = ['inactivity_reminder', 'leaderboard_rank_change', 'streak_milestone'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      const userData = {
        userId: localStorage.getItem('userEmail') || 'test@example.com',
      };

      if (randomType === 'inactivity_reminder') {
        addNotification(randomType, {
          ...userData,
          hoursInactive: 24,
        });
      } else if (randomType === 'leaderboard_rank_change') {
        addNotification(randomType, {
          ...userData,
          previousRank: Math.floor(Math.random() * 50) + 10,
          newRank: Math.floor(Math.random() * 10) + 1,
          improvement: true,
          positionsChanged: Math.floor(Math.random() * 5) + 1,
        });
      } else if (randomType === 'streak_milestone') {
        addNotification(randomType, {
          ...userData,
          streakDays: Math.floor(Math.random() * 50) * 5,
          isMilestone: true,
        });
      }
      
      console.log(`[TestNotification] Sent: ${randomType}`);
      console.log('[TestNotification] Current notifications:', notifications);
    };

    // Test rank change notification specifically
    window.testRankChange = (previousRank = 5, newRank = 2) => {
      const userEmail = localStorage.getItem('userEmail') || 'test@example.com';
      const isImprovement = previousRank > newRank;
      
      addNotification('leaderboard_rank_change', {
        userId: userEmail,
        previousRank: previousRank,
        newRank: newRank,
        improvement: isImprovement,
        positionsChanged: Math.abs(previousRank - newRank),
      });
      
      console.log(`[TestRankChange] Simulated rank change: #${previousRank} → #${newRank}`);
      console.log('[TestRankChange] Notification sent:', {
        improvement: isImprovement,
        positionsChanged: Math.abs(previousRank - newRank),
      });
    };

    window.testStreakMilestone = (streakDays = 5) => {
      const userEmail = localStorage.getItem('userEmail') || 'test@example.com';
      
      addNotification('streak_milestone', {
        userId: userEmail,
        streakDays: streakDays,
        isMilestone: true,
      });
      
      console.log(`[TestStreakMilestone] Sent notification for ${streakDays}-day streak`);
    };

    window.testInactivityReminder = () => {
      const userEmail = localStorage.getItem('userEmail') || 'test@example.com';
      
      addNotification('inactivity_reminder', {
        userId: userEmail,
        hoursInactive: 24,
      });
      
      console.log('[TestInactivityReminder] Sent inactivity reminder');
    };

    window.clearNotifications = () => {
      localStorage.removeItem('mokey_notifications');
      window.location.reload();
      console.log('[TestNotification] Cleared all notifications');
    };

    console.log('%c[Notification System] Ready for testing', 'color: green; font-weight: bold;');
    console.log('Use these commands in browser console:');
    console.log('  window.testNotification() - Send a random test notification');
    console.log('  window.testRankChange(previousRank, newRank) - Test rank change (e.g., testRankChange(5, 2))');
    console.log('  window.testStreakMilestone(days) - Test streak milestone (e.g., testStreakMilestone(5))');
    console.log('  window.testInactivityReminder() - Test inactivity reminder');
    console.log('  window.clearNotifications() - Clear all notifications');

    return () => {
      delete window.testNotification;
      delete window.testRankChange;
      delete window.testStreakMilestone;
      delete window.testInactivityReminder;
      delete window.clearNotifications;
    };
  }, [addNotification, notifications]);
};
