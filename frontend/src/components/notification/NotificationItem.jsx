import React from 'react';
import { Flame, TrendingUp, Clock, Zap, X, Check } from 'lucide-react';

const getNotificationConfig = (notification) => {
  const { type, data } = notification;

  const configs = {
    inactivity_reminder: {
      icon: Clock,
      title: '🔔 We Miss You!',
      description: `It's been ${data.hoursInactive || 24} hours since your last visit. Come back and maintain your momentum!`,
      color: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
      actionText: 'Continue Typing',
    },
    leaderboard_rank_change: {
      icon: TrendingUp,
      title: data.improvement ? '📈 Rank Improved!' : '📉 Rank Update',
      description: data.improvement
        ? `Awesome! You jumped ${data.positionsChanged} position${data.positionsChanged > 1 ? 's' : ''} to rank #${data.newRank}.`
        : `You're now at rank #${data.newRank}. Keep pushing!`,
      color: data.improvement
        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
        : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
      iconColor: data.improvement ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400',
      actionText: 'View Leaderboard',
    },
    streak_milestone: {
      icon: Flame,
      title: '🔥 Streak Achievement!',
      description: `Incredible! You've maintained a ${data.streakDays}-day typing streak. You're on fire! 🎉`,
      color: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
      iconColor: 'text-red-600 dark:text-red-400',
      actionText: 'Celebrate!',
    },
  };

  return configs[type] || {
    icon: Zap,
    title: 'Notification',
    description: 'You have a new notification',
    color: 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700',
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
        relative px-5 py-4 border-l-4
        ${notification.read ? 'border-gray-200' : 'border-blue-500'}
        ${config.color}
        rounded-lg transition-all duration-300 ease-out
        ${!notification.read ? 'shadow-sm' : ''}
        hover:shadow-md
      `}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div className={`shrink-0 ${config.iconColor} mt-1`}>
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                {config.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                {config.description}
              </p>
            </div>

            {/* Actions */}
            <div className="shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                  title="Mark as read"
                >
                  <Check className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              )}
              <button
                onClick={() => onDelete(notification.id)}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Delete"
              >
                <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Timestamp and Read Indicator */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {formatTimeAgo(notification.timestamp)}
            </span>
            {!notification.read && (
              <span className="inline-block h-2 w-2 bg-blue-500 rounded-full" />
            )}
          </div>
        </div>
      </div>

      {/* Unread dot (left side) */}
      {!notification.read && (
        <div className="absolute top-4 -left-1 h-2 w-2 bg-blue-500 rounded-full" />
      )}
    </div>
  );
};

export default NotificationItem;
