import React from 'react';
import { Flame, TrendingUp, Clock, Zap, Trophy, Check, Trash2, ArrowUpRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ACHIEVEMENTS_CONFIG } from '../../config/achievements';

const getAchievementMeta = (achievementId) =>
  ACHIEVEMENTS_CONFIG.find((achievement) => achievement.id === achievementId);

const getNotificationConfig = (notification) => {
  const { type, data } = notification;

  const configs = {
    inactivity_reminder: {
      icon: Clock,
      categoryLabel: 'REMINDER',
      title: 'Practice Momentum Warning',
      description: `It's been ${data.hoursInactive || 24} hours since your last typing test. Keep your fingers warm and maintain your speed!`,
      gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
      badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 shadow-blue-500/20',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      actionText: 'Resume Typing',
      actionRoute: '/home',
    },
    leaderboard_rank_change: {
      icon: TrendingUp,
      categoryLabel: data.improvement ? 'RANK UP' : 'RANK UPDATE',
      title: data.improvement ? '🚀 Leaderboard Rank Up!' : '⚡ Leaderboard Rank Changed',
      description: data.improvement
        ? `Awesome news! You climbed ${data.positionsChanged || 1} spot${(data.positionsChanged || 1) > 1 ? 's' : ''}! Moving up from #${data.previousRank} to #${data.newRank}.`
        : `Your leaderboard position changed from #${data.previousRank} to #${data.newRank}. Defend your rank!`,
      gradient: data.improvement
        ? 'from-emerald-500/20 via-teal-500/10 to-transparent'
        : 'from-amber-500/20 via-orange-500/10 to-transparent',
      badgeBg: data.improvement
        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      iconBg: data.improvement
        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/20'
        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-amber-500/20',
      glowColor: data.improvement ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)',
      actionText: 'View Standings',
      actionRoute: '/leaderboard',
    },
    achievement_unlocked: {
      icon: Trophy,
      categoryLabel: 'ACHIEVEMENT',
      title: '🏆 Achievement Unlocked!',
      description: (() => {
        const achievement = getAchievementMeta(data.achievementId);
        if (!achievement) return `Congratulations on unlocking: ${data.achievementId}`;
        return `${achievement.title} — ${achievement.subtitle}`;
      })(),
      gradient: 'from-amber-500/20 via-purple-500/10 to-transparent',
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      iconBg: 'bg-amber-500/15 text-amber-500 dark:text-amber-400 shadow-amber-500/20',
      glowColor: 'rgba(245, 158, 11, 0.5)',
      actionText: 'View Trophies',
      actionRoute: '/profile',
    },
    streak_milestone: {
      icon: Flame,
      categoryLabel: 'STREAK',
      title: '🔥 Streak Milestone Smashed!',
      description: `Incredible dedication! You've maintained a ${data.streakDays}-day typing streak. Keep the heat alive!`,
      gradient: 'from-rose-500/20 via-orange-500/10 to-transparent',
      badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 shadow-rose-500/20',
      glowColor: 'rgba(244, 63, 94, 0.4)',
      actionText: 'Keep Streak Alive',
      actionRoute: '/home',
    },
  };

  return configs[type] || {
    icon: Sparkles,
    categoryLabel: 'SYSTEM',
    title: 'System Notification',
    description: 'You have a new update in your account',
    gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    iconBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 shadow-purple-500/20',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    actionText: 'Explore',
    actionRoute: '/home',
  };
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now';
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const navigate = useNavigate();
  const config = getNotificationConfig(notification);
  const Icon = config.icon;
  const isUnread = !notification.read;

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (isUnread) {
      onMarkAsRead(notification.id);
    }
    if (config.actionRoute) {
      navigate(config.actionRoute);
    }
  };

  return (
    <div
      onClick={() => isUnread && onMarkAsRead(notification.id)}
      className={`
        group relative overflow-hidden rounded-2xl border transition-all duration-300 ease-out cursor-pointer
        ${isUnread
          ? 'bg-card/90 dark:bg-zinc-900/80 border-amber-500/30 dark:border-amber-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]'
          : 'bg-card/40 hover:bg-card/70 border-border/50 hover:border-border/80 opacity-85 hover:opacity-100'
        }
      `}
    >
      {/* Background Gradient & Glow Backdrop */}
      <div
        className={`absolute top-0 right-0 w-72 h-72 bg-gradient-to-br ${config.gradient} rounded-full blur-3xl opacity-30 pointer-events-none transition-opacity duration-500 group-hover:opacity-60`}
      />

      {/* Unread Glowing Left Edge Indicator */}
      {isUnread && (
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
      )}

      <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
        {/* Category Icon */}
        <div className="relative shrink-0">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${config.iconBg} backdrop-blur-md transition-transform duration-300 group-hover:scale-105`}
            style={{ boxShadow: `0 4px 20px ${config.glowColor}` }}
          >
            <Icon className="w-6 h-6" />
          </div>
          {isUnread && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-background shadow-xs animate-pulse" />
          )}
        </div>

        {/* Notification Main Info */}
        <div className="flex-1 min-w-0 space-y-2.5">
          {/* Header row: Badge, Timestamp, Hover controls */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border ${config.badgeBg}`}>
                {config.categoryLabel}
              </span>
              <span className="text-xs font-medium text-muted-foreground/80">
                {formatTimeAgo(notification.timestamp)}
              </span>
            </div>

            {/* Quick Action Tools */}
            <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
              {isUnread && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Delete notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <h3 className={`text-base font-bold tracking-tight ${isUnread ? 'text-foreground font-extrabold' : 'text-foreground/90'}`}>
              {config.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              {config.description}
            </p>
          </div>

          {/* Interactive CTA Link Button */}
          {config.actionText && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleActionClick}
                className={`
                  inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-xs active:scale-95
                  ${isUnread
                    ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/20'
                    : 'bg-muted/80 hover:bg-muted text-foreground border border-border/60'
                  }
                `}
              >
                <span>{config.actionText}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
