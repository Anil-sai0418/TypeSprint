import { useEffect, useRef } from 'react';
import { useNotification } from '../context/NotificationContext';
import { getLeaderboard, getFullUserProfile } from '../services/api';

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

  useEffect(() => {
    if (!enabled || !userEmail) {
      return;
    }

    previousRankRef.current = null;

    const checkRank = async () => {
      try {
        const response = await getLeaderboard(200);
        
        if (!response.success) {
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
          // Rank changed - send notification
          const rankChanged = previousRankRef.current - currentRank;
          const isImprovement = rankChanged > 0;

          addNotification('leaderboard_rank_change', {
            userId: userEmail,
            previousRank: previousRankRef.current,
            newRank: currentRank,
            improvement: isImprovement,
            positionsChanged: Math.abs(rankChanged),
          });

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
  }, [addNotification, enabled, userEmail]);
};

// Hook to monitor streaks
export const useStreakTracking = ({ enabled = true, userEmail, token } = {}) => {
  const { addNotification } = useNotification();
  const previousStreakRef = useRef(null);

  useEffect(() => {
    if (!enabled || !userEmail || !token) return; // Don't track if not logged in

    previousStreakRef.current = null;

    // Check streak periodically
    const checkStreak = async () => {
      try {
        const response = await getFullUserProfile(userEmail, token);
        
        if (response.success && response.userProfile) {
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
  }, [addNotification, enabled, userEmail, token]);
};

// Hook to monitor newly unlocked achievements
export const useAchievementTracking = ({ enabled = true, userEmail, token } = {}) => {
  const { addNotification } = useNotification();
  const knownAchievementsRef = useRef(null);

  useEffect(() => {
    if (!enabled || !userEmail || !token) return;

    knownAchievementsRef.current = null;

    const checkAchievements = async () => {
      try {
        const response = await getFullUserProfile(userEmail, token);
        if (!response?.success) return;

        const currentAchievements =
          response.profile?.achievements ||
          response.userProfile?.achievements ||
          [];

        if (!Array.isArray(currentAchievements)) return;

        if (knownAchievementsRef.current === null) {
          knownAchievementsRef.current = currentAchievements;
          return;
        }

        const previousSet = new Set(knownAchievementsRef.current);
        const newUnlocks = currentAchievements.filter((item) => !previousSet.has(item));

        newUnlocks.forEach((achievementId) => {
          addNotification('achievement_unlocked', {
            userId: userEmail,
            achievementId,
          });
        });

        knownAchievementsRef.current = currentAchievements;
      } catch (error) {
        console.error('Error checking achievements:', error);
      }
    };

    checkAchievements();
    const checkAchievementsInterval = setInterval(checkAchievements, 60 * 1000);

    return () => clearInterval(checkAchievementsInterval);
  }, [addNotification, enabled, userEmail, token]);
};
