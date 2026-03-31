import React from 'react';
import { Flame, TrendingUp, Clock, Zap, X, Check } from 'lucide-react';
import { ACHIEVEMENTS_CONFIG } from '../../config/achievements';

const getAchievementMeta = (achievementId) =>
  ACHIEVEMENTS_CONFIG.find((achievement) => achievement.id === achievementId);

const getNotificationConfig = (notification) => {
  const { type, data } = notification;

  const configs = {
    inactivity_reminder: {
      icon: Clock,
      title: '🔔 We Miss You!',
      description: `It's been ${data.hoursInactive || 24} hours since your last visit. Come back and maintain your momentum!`,
      color: 'bg-blue-50/60 border-blue-300 dark:bg-blue-950/30 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
      actionText: 'Continue Typing',
    },
    leaderboard_rank_change: {
      icon: TrendingUp,
      title: data.improvement ? '📈 Rank Improved!' : '📉 Rank Updated',
      description: data.improvement
        ? `Awesome! You moved up ${data.positionsChanged} position${data.positionsChanged > 1 ? 's' : ''}: #${data.previousRank} → #${data.newRank}.`
        : `Your rank changed from #${data.previousRank} to #${data.newRank}. Keep pushing!`,
      color: data.improvement
        ? 'bg-green-50/60 border-green-300 dark:bg-green-950/30 dark:border-green-800'
        : 'bg-amber-50/60 border-amber-300 dark:bg-amber-950/30 dark:border-amber-800',
      iconColor: data.improvement
        ? 'text-green-600 dark:text-green-400'
        : 'text-amber-600 dark:text-amber-400',
      actionText: 'View Leaderboard',
    },
    achievement_unlocked: {
      icon: Zap,
      title: '🏆 Achievement Unlocked',
      description: (() => {
        const achievement = getAchievementMeta(data.achievementId);
        if (!achievement) return `You unlocked: ${data.achievementId}`;
        return `${achievement.title} — ${achievement.subtitle}`;
      })(),
      color: 'bg-purple-50/60 border-purple-300 dark:bg-purple-950/30 dark:border-purple-800',
      iconColor: 'text-purple-600 dark:text-purple-400',
      actionText: 'View Profile',
    },
    streak_milestone: {
      icon: Flame,
      title: '🔥 Streak Achievement!',
      description: `Incredible! You've maintained a ${data.streakDays}-day typing streak. You're on fire! 🎉`,
      color: 'bg-red-50/60 border-red-300 dark:bg-red-950/30 dark:border-red-800',
      iconColor: 'text-red-600 dark:text-red-400',
      actionText: 'Celebrate!',
    },
  };

  return configs[type] || {
    icon: Zap,
    title: 'Notification',
    description: 'You have a new notification',
    color: 'bg-gray-50/60 border-gray-300 dark:bg-gray-900/30 dark:border-gray-700',
    iconColor: 'text-gray-600 dark:text-gray-400',
    actionText: 'View',
  };
};

// Format time ago
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const config = getNotificationConfig(notification);
  const Icon = config.icon;

  return (
    <div
      className={`
        relative px-5 py-5 border transition-all duration-300 ease-out
        rounded-2xl overflow-hidden group/item
        ${!notification.read ? 'shadow-md shadow-primary/5 hover:shadow-lg' : 'shadow-none hover:bg-muted/30 border-transparent hover:border-border'}
        ${!notification.read ? 'bg-card border-primary/20' : 'bg-transparent'}
      `}
    >
      <div className="flex gap-4">
        {/* Icon with animated background */}
        <div className={`shrink-0 ${config.iconColor} mt-0.5 relative`}>
          <div className={`absolute inset-0 opacity-10 rounded-full blur-md scale-150 ${config.color.split(' ')[0]}`} />
          <Icon className="h-6 w-6 relative z-10" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className={`font-bold text-base leading-snug ${!notification.read ? 'text-foreground' : 'text-foreground/80'}`}>
                {config.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                {config.description}
              </p>
            </div>

            {/* Actions - show on hover */}
            <div className="shrink-0 flex items-center gap-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-2 hover:bg-accent/60 rounded-md transition-colors duration-150 text-muted-foreground hover:text-foreground"
                  title="Mark as read"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => onDelete(notification.id)}
                className="p-2 hover:bg-destructive/10 rounded-md transition-colors duration-150 text-muted-foreground hover:text-destructive"
                title="Delete notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Timestamp and Read Indicator */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <span className="text-xs font-medium text-muted-foreground">
              {formatTimeAgo(notification.timestamp)}
            </span>
            {!notification.read && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary font-semibold">
                New
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Unread indicator dot (left edge) */}
      {!notification.read && (
        <div className="absolute top-4 -left-0.5 h-3 w-3 bg-primary rounded-full shadow-sm" />
      )}

      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default NotificationItem;
