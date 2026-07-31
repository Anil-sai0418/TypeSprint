import React, { useState, useRef, useEffect } from 'react';
import { Bell, Trophy, Flame, TrendingUp, Clock, Check, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useNotification } from '../../context/NotificationContext';
import { ACHIEVEMENTS_CONFIG } from '../../config/achievements';

const Notification = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();

  const getAchievementMeta = (achievementId) =>
    ACHIEVEMENTS_CONFIG.find((achievement) => achievement.id === achievementId);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get rich metadata for each notification type
  const getNotificationDisplay = (notification) => {
    const { type, data } = notification;
    
    switch (type) {
      case 'inactivity_reminder':
        return {
          icon: Clock,
          iconBg: 'bg-blue-500/10 text-blue-500',
          title: 'We Miss You!',
          desc: `It's been ${data.hoursInactive || 24} hours since your last session`
        };
      case 'leaderboard_rank_change':
        {
          const isImprovement = Boolean(data.improvement);
          const previousRank = data.previousRank;
          const newRank = data.newRank;
          const positions = data.positionsChanged || 0;

          return {
            icon: TrendingUp,
            iconBg: isImprovement ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500',
            title: isImprovement ? 'Rank Improved!' : 'Rank Updated',
            desc: isImprovement
              ? `Moved up ${positions} spot${positions > 1 ? 's' : ''}: #${previousRank} → #${newRank}`
              : `Rank changed: #${previousRank} → #${newRank}`
          };
        }
      case 'achievement_unlocked':
        {
          const achievement = getAchievementMeta(data.achievementId);
          return {
            icon: Trophy,
            iconBg: 'bg-purple-500/10 text-purple-500',
            title: 'Achievement Unlocked',
            desc: achievement
              ? `${achievement.title} — ${achievement.subtitle}`
              : `You unlocked: ${data.achievementId}`
          };
        }
      case 'streak_milestone':
        return {
          icon: Flame,
          iconBg: 'bg-rose-500/10 text-rose-500',
          title: 'Streak Milestone!',
          desc: `${data.streakDays}-day typing streak maintained! 🔥`
        };
      default:
        return {
          icon: Sparkles,
          iconBg: 'bg-primary/10 text-primary',
          title: 'Notification',
          desc: 'You have a new update'
        };
    }
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative flex items-center justify-center" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          relative p-2.5 rounded-xl transition-all duration-300 group
          bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground
          border border-border/80 shadow-xs hover:border-border active:scale-95
          ${open ? 'bg-muted text-foreground border-border ring-2 ring-primary/20' : ''}
        `}
        aria-label="Notifications"
      >
        <Bell className="h-4.5 w-4.5 transition-transform group-hover:rotate-12" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.6)] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Upgraded Modern Popover */}
      {open && (
        <div
          className="
            absolute right-0 top-13 w-88 max-w-[92vw] rounded-2xl shadow-2xl z-50
            bg-card/95 backdrop-blur-2xl text-card-foreground
            border border-border/80 divide-y divide-border/50
            animate-in fade-in zoom-in-95 duration-200 overflow-hidden
          "
        >
          {/* Header */}
          <div className="px-4 py-3.5 flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full text-[11px] font-extrabold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
              >
                <Check className="w-3.5 h-3.5" />
                Mark read
              </button>
            )}
          </div>

          {/* List */}
          <ul className="max-h-80 overflow-y-auto divide-y divide-border/40">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => {
                const display = getNotificationDisplay(notification);
                const IconComponent = display.icon;

                return (
                  <li
                    key={notification.id}
                    onClick={() => {
                      markAsRead(notification.id);
                      setOpen(false);
                      navigate('/notifications');
                    }}
                    className={`
                      p-3.5 cursor-pointer transition-all duration-200 flex items-start gap-3.5
                      hover:bg-muted/50 relative group
                      ${!notification.read ? 'bg-primary/5 dark:bg-amber-400/5' : ''}
                    `}
                  >
                    {!notification.read && (
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                    )}

                    <div className={`p-2.5 rounded-xl shrink-0 ${display.iconBg}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground leading-tight group-hover:text-amber-500 transition-colors">
                        {display.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {display.desc}
                      </p>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="p-8 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 stroke-1" />
                <p className="text-xs font-medium">All caught up!</p>
                <p className="text-[11px] opacity-70 mt-0.5">No new notifications</p>
              </li>
            )}
          </ul>

          {/* Footer */}
          <div className="p-2.5 bg-muted/20 text-center">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/notifications");
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <span>View all notifications</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
