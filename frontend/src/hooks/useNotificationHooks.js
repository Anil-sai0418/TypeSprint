import { useEffect, useRef } from 'react';
import { useNotification } from '../context/NotificationContext';
import { getLeaderboard, getFullUserProfile } from '../services/api';

// Hook to track user activity and send inactivity reminders
export const useActivityTracking = () => {
  const { addNotification } = useNotification();
  const lastActivityRef = useRef(Date.now());
  const inactivityReminderSentRef = useRef(false);

  useEffect(() => {
    // Update last activity on user interaction
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
      inactivityReminderSentRef.current = false;
    };

    window.addEventListener('mousedown', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);

    // Check for inactivity every hour
    const hourInMs = 60 * 60 * 1000;
    const inactivityCheckInterval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;

      // If 24 hours have passed and reminder hasn't been sent
      if (
        timeSinceLastActivity >= 24 * hourInMs &&
        !inactivityReminderSentRef.current
      ) {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          addNotification('inactivity_reminder', {
            userId: userEmail,
            hoursInactive: Math.floor(timeSinceLastActivity / hourInMs),
          });
          inactivityReminderSentRef.current = true;
        }
      }
    }, hourInMs);

    return () => {
      window.removeEventListener('mousedown', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      clearInterval(inactivityCheckInterval);
    };
  }, [addNotification]);
};

// Hook to monitor leaderboard ranking changes
export const useLeaderboardTracking = () => {
  const { addNotification } = useNotification();
  const previousRankRef = useRef(null);
  const userEmailRef = useRef(localStorage.getItem('userEmail'));

  useEffect(() => {
    if (!userEmailRef.current) {
      console.log('[LeaderboardTracking] No user email found, skipping');
      return;
    }

    const checkRank = async () => {
      try {
        const response = await getLeaderboard(200);
        
        if (!response.success) {
          console.log('[LeaderboardTracking] Failed to fetch leaderboard:', response.message);
          return;
        }

        if (!response.leaderboard || !Array.isArray(response.leaderboard)) {
          console.log('[LeaderboardTracking] Invalid leaderboard data:', response);
          return;
        }

        // Find user by email in the leaderboard
        const userInLeaderboard = response.leaderboard.find(
          (leader) => leader.email && leader.email.toLowerCase() === userEmailRef.current.toLowerCase()
        );

        if (!userInLeaderboard) {
          console.log('[LeaderboardTracking] User not found in leaderboard. Email:', userEmailRef.current);
          console.log('[LeaderboardTracking] Leaderboard emails:', response.leaderboard.map(l => l.email).slice(0, 5));
          return;
        }

        const currentRank = userInLeaderboard.rank;
        console.log('[LeaderboardTracking] Found user rank:', currentRank);

        if (previousRankRef.current === null) {
          // First check - just store the rank
          previousRankRef.current = currentRank;
          console.log(`[LeaderboardTracking] Initial rank set: #${currentRank}`);
        } else if (previousRankRef.current !== currentRank) {
          // Rank changed - send notification
          const rankChanged = previousRankRef.current - currentRank;
          const isImprovement = rankChanged > 0;

          console.log(`[LeaderboardTracking] RANK CHANGED! From #${previousRankRef.current} to #${currentRank}`);

          addNotification('leaderboard_rank_change', {
            userId: userEmailRef.current,
            previousRank: previousRankRef.current,
            newRank: currentRank,
            improvement: isImprovement,
            positionsChanged: Math.abs(rankChanged),
          });

          previousRankRef.current = currentRank;
        } else {
          console.log(`[LeaderboardTracking] Rank unchanged: #${currentRank}`);
        }
      } catch (error) {
        console.error('[LeaderboardTracking] Error checking leaderboard rank:', error);
      }
    };

    // Check immediately on mount
    console.log('[LeaderboardTracking] Starting leaderboard tracking for:', userEmailRef.current);
    checkRank();

    // Then check every 30 seconds (faster for real-time detection)
    const checkRankInterval = setInterval(checkRank, 30 * 1000);

    return () => clearInterval(checkRankInterval);
  }, [addNotification]);
};

// Hook to monitor streaks
export const useStreakTracking = () => {
  const { addNotification } = useNotification();
  const previousStreakRef = useRef(null);
  const userEmailRef = useRef(localStorage.getItem('userEmail'));
  const tokenRef = useRef(localStorage.getItem('token'));

  useEffect(() => {
    if (!userEmailRef.current || !tokenRef.current) return; // Don't track if not logged in

    // Check streak every minute (faster for testing)
    const checkStreak = async () => {
      try {
        const response = await getFullUserProfile(userEmailRef.current, tokenRef.current);
        
        if (response.success && response.userProfile) {
          const currentStreak = response.userProfile?.streak || 0;

          if (previousStreakRef.current === null) {
            // First check - just store the streak
            previousStreakRef.current = currentStreak;
            console.log(`[StreakTracking] Initial streak: ${currentStreak} days`);
          } else if (currentStreak > previousStreakRef.current) {
            // Streak increased
            console.log(`[StreakTracking] Streak increased from ${previousStreakRef.current} to ${currentStreak} days`);
            
            // Check if it's a milestone (5, 10, 15, etc.)
            if (currentStreak % 5 === 0) {
              console.log(`[StreakTracking] Milestone reached: ${currentStreak} days!`);
              addNotification('streak_milestone', {
                userId: userEmailRef.current,
                streakDays: currentStreak,
                isMilestone: true,
              });
            }
            previousStreakRef.current = currentStreak;
          } else if (currentStreak < previousStreakRef.current) {
            // Streak was lost
            console.log(`[StreakTracking] Streak lost: from ${previousStreakRef.current} to ${currentStreak} days`);
            previousStreakRef.current = currentStreak;
          }
        }
      } catch (error) {
        console.error('Error checking streak:', error);
      }
    };

    // Check immediately on mount
    checkStreak();

    // Then check every 1 minute
    const checkStreakInterval = setInterval(checkStreak, 1 * 60 * 1000);

    return () => clearInterval(checkStreakInterval);
  }, [addNotification]);
};
