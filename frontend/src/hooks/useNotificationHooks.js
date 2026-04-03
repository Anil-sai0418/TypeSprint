import { useEffect, useRef } from 'react';
import { useNotification } from '../context/NotificationContext';
import { getLeaderboard, getFullUserProfile } from '../services/api';
import { useQueryClient } from '@tanstack/react-query';

// Hook to track user activity and send inactivity reminders
export const useActivityTracking = ({ enabled = true, userEmail } = {}) => {
  const { addNotification } = useNotification();
  const lastActivityRef = useRef(Date.now());
  const inactivityReminderSentRef = useRef(false);

  useEffect(() => {
    if (!enabled || !userEmail) return;

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
        addNotification('inactivity_reminder', {
          userId: userEmail,
          hoursInactive: Math.floor(timeSinceLastActivity / hourInMs),
        });
        inactivityReminderSentRef.current = true;
      }
    }, hourInMs);

    return () => {
      window.removeEventListener('mousedown', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      clearInterval(inactivityCheckInterval);
    };
  }, [addNotification, enabled, userEmail]);
};

// Hook to monitor leaderboard ranking changes
export const useLeaderboardTracking = ({ enabled = true, userEmail } = {}) => {
  const { addNotification } = useNotification();
  const previousRankRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !userEmail) {
      return;
    }

    previousRankRef.current = null;

    const checkRank = async () => {
      try {
        const response = await queryClient.fetchQuery({
          queryKey: ['leaderboard', 200],
          queryFn: () => getLeaderboard(200),
          staleTime: 55 * 1000 // Only fetch network if data is older than 55 seconds. Otherwise returns cache.
        });
        
        if (!response?.success) {
          return;
        }

        if (!response.leaderboard || !Array.isArray(response.leaderboard)) {
          return;
        }

        // Find user by email in the leaderboard
        const userInLeaderboard = response.leaderboard.find(
          (leader) => leader.email && leader.email.toLowerCase() === userEmail.toLowerCase()
        );

        if (!userInLeaderboard) {
          return;
        }

        const currentRank = userInLeaderboard.rank;

        if (previousRankRef.current === null) {
          // First check - just store the rank
          previousRankRef.current = currentRank;
        } else if (previousRankRef.current !== currentRank) {
          // Rank changed - send notification ONLY if it's an improvement
          const rankChanged = previousRankRef.current - currentRank;
          const isImprovement = rankChanged > 0;

          if (isImprovement) {
            addNotification('leaderboard_rank_change', {
              userId: userEmail,
              previousRank: previousRankRef.current,
              newRank: currentRank,
              improvement: isImprovement,
              positionsChanged: Math.abs(rankChanged),
            });
          }

          // Always update the ref so we don't alert on regression and don't re-alert on the next tick
          previousRankRef.current = currentRank;
        }
      } catch (error) {
        console.error('Error checking leaderboard rank:', error);
      }
    };

    // Check immediately on mount
    checkRank();

    // Then check every minute
    const checkRankInterval = setInterval(checkRank, 60 * 1000);

    return () => clearInterval(checkRankInterval);
  }, [addNotification, enabled, userEmail, queryClient]);
};

// Hook to monitor streaks
export const useStreakTracking = ({ enabled = true, userEmail, token } = {}) => {
  const { addNotification } = useNotification();
  const previousStreakRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !userEmail || !token) return; // Don't track if not logged in

    previousStreakRef.current = null;

    // Check streak periodically
    const checkStreak = async () => {
      try {
        const response = await queryClient.fetchQuery({
          queryKey: ['userProfile', userEmail],
          queryFn: () => getFullUserProfile(userEmail, token),
          staleTime: 5 * 60 * 1000 // 5 minutes cache
        });
        
        if (response?.success && response.userProfile) {
          const currentStreak = response.userProfile?.streak || 0;

          if (previousStreakRef.current === null) {
            // First check - just store the streak
            previousStreakRef.current = currentStreak;
          } else if (currentStreak > previousStreakRef.current) {
            // Streak increased
            // Check if it's a milestone (5, 10, 15, etc.)
            if (currentStreak % 5 === 0) {
              addNotification('streak_milestone', {
                userId: userEmail,
                streakDays: currentStreak,
                isMilestone: true,
              });
            }
            previousStreakRef.current = currentStreak;
          } else if (currentStreak < previousStreakRef.current) {
            // Streak was lost
            previousStreakRef.current = currentStreak;
          }
        }
      } catch (error) {
        console.error('Error checking streak:', error);
      }
    };

    // Check immediately on mount
    checkStreak();

    // Then check every 3 minutes
    const checkStreakInterval = setInterval(checkStreak, 3 * 60 * 1000);

    return () => clearInterval(checkStreakInterval);
  }, [addNotification, enabled, userEmail, token, queryClient]);
};

// Hook to monitor newly unlocked achievements
export const useAchievementTracking = ({ enabled = true, userEmail, token } = {}) => {
  const { addNotification } = useNotification();
  const previousAchievementsRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !userEmail || !token) return;

    previousAchievementsRef.current = null;

    const checkAchievements = async () => {
      try {
        const response = await queryClient.fetchQuery({
          queryKey: ['userProfile', userEmail],
          queryFn: () => getFullUserProfile(userEmail, token),
          staleTime: 5 * 60 * 1000 // 5 minutes cache
        });
        
        if (response?.success && response.userProfile?.achievements) {
          const currentAchievements = response.userProfile.achievements;

          if (previousAchievementsRef.current === null) {
            // First check - just store the achievements
            previousAchievementsRef.current = currentAchievements;
          } else {
            // Find new unlocks
            const previousSet = new Set(previousAchievementsRef.current);
            const newUnlocks = currentAchievements.filter((item) => !previousSet.has(item));

            newUnlocks.forEach((achievementId) => {
              addNotification('achievement_unlocked', {
                userId: userEmail,
                achievementId,
              });
            });

            previousAchievementsRef.current = currentAchievements;
          }
        }
      } catch (error) {
        console.error('Error checking achievements:', error);
      }
    };

    checkAchievements();
    const checkAchievementsInterval = setInterval(checkAchievements, 60 * 1000);

    return () => clearInterval(checkAchievementsInterval);
  }, [addNotification, enabled, userEmail, token, queryClient]);
};
