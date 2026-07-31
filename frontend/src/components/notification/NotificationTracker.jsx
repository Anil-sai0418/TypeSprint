import { useActivityTracking, useLeaderboardTracking, useStreakTracking, useAchievementTracking } from '../../hooks/useNotificationHooks';
import { useAuth } from '../../context/useAuth';

const NotificationTracker = () => {
  const { isAuthenticated, user } = useAuth();

  const userEmail = user?.email || localStorage.getItem('userEmail');
  const token = localStorage.getItem('token');
  const enabled = Boolean(isAuthenticated && userEmail && token);

  // Only run leaderboard rank tracking when user visits leaderboard to prevent eager boot requests
  const isLeaderboardPage = typeof window !== 'undefined' && window.location.pathname.includes('/leaderboard');

  useActivityTracking({ enabled, userEmail });
  useLeaderboardTracking({ enabled: enabled && isLeaderboardPage, userEmail });
  useStreakTracking({ enabled, userEmail, token });
  useAchievementTracking({ enabled, userEmail, token });

  return null;
};

export default NotificationTracker;
