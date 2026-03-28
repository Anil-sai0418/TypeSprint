import { useActivityTracking, useLeaderboardTracking, useStreakTracking, useAchievementTracking } from '../../hooks/useNotificationHooks';
import { useAuth } from '../../context/useAuth';

const NotificationTracker = () => {
  const { isAuthenticated, user } = useAuth();

  const userEmail = user?.email || localStorage.getItem('userEmail');
  const token = localStorage.getItem('token');
  const enabled = Boolean(isAuthenticated && userEmail && token);

  useActivityTracking({ enabled, userEmail });
  useLeaderboardTracking({ enabled, userEmail });
  useStreakTracking({ enabled, userEmail, token });
  useAchievementTracking({ enabled, userEmail, token });

  return null;
};

export default NotificationTracker;
