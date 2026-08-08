import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Bell, Trophy, Flame, TrendingUp, Clock, Check, ChevronRight, Sparkles, Inbox } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useNotification } from '../../context/NotificationContext';
import { ACHIEVEMENTS_CONFIG } from '../../config/achievements';

const Notification = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'unread'
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

  // Rich category metadata
  const getNotificationDisplay = (notification) => {
    const { type, data } = notification;
    
    switch (type) {
      case 'inactivity_reminder':
        return {
          icon: Clock,
          iconBg: 'bg-blue-500/15 text-blue-500 border-blue-500/20',
          title: 'Speed Momentum Alert',
          desc: `It's been ${data.hoursInactive || 24} hours since your last session`
        };
      case 'leaderboard_rank_change':
        {
          const isImprovement = Boolean(data.improvement);
          const previousRank = data.previousRank;
          const newRank = data.newRank;
          const positions = data.positionsChanged || 1;

          return {
            icon: TrendingUp,
            iconBg: isImprovement 
              ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20' 
              : 'bg-amber-500/15 text-amber-500 border-amber-500/20',
            title: isImprovement ? '🚀 Rank Improved!' : '⚡ Leaderboard Rank Updated',
            desc: isImprovement
              ? `Climbed ${positions} spot${positions > 1 ? 's' : ''}: #${previousRank} → #${newRank}`
              : `Rank changed: #${previousRank} → #${newRank}`
          };
        }
      case 'achievement_unlocked':
        {
          const achievement = getAchievementMeta(data.achievementId);
          return {
            icon: Trophy,
            iconBg: 'bg-amber-500/15 text-amber-500 border-amber-500/20',
            title: '🏆 Achievement Unlocked',
            desc: achievement
              ? `${achievement.title} — ${achievement.subtitle}`
              : `You unlocked: ${data.achievementId}`
          };
        }
      case 'streak_milestone':
        return {
          icon: Flame,
          iconBg: 'bg-rose-500/15 text-rose-500 border-rose-500/20',
          title: '🔥 Streak Milestone!',
          desc: `${data.streakDays}-day typing streak maintained!`
        };
      default:
        return {
          icon: Sparkles,
          iconBg: 'bg-purple-500/15 text-purple-500 border-purple-500/20',
          title: 'System Notification',
          desc: 'You have a new update in your account'
        };
    }
  };

  const displayedNotifications = useMemo(() => {
    let items = notifications;
    if (activeTab === 'unread') {
      items = items.filter(n => !n.read);
    }
    return items.slice(0, 6);
  }, [notifications, activeTab]);

  return (
    <div className="relative flex items-center justify-center" ref={dropdownRef}>
      {/* Bell Trigger Button with Ambient Pulse */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          relative p-2.5 rounded-2xl transition-all duration-300 group
          bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground
          border border-border/80 shadow-xs hover:border-border active:scale-95
          ${open ? 'bg-muted text-foreground border-amber-500/40 ring-2 ring-amber-500/20 shadow-lg' : ''}
        `}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-amber-500 text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.8)] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Modern Floating Glass Popover */}
      {open && (
        <div
          className="
            absolute right-0 top-14 w-96 max-w-[92vw] rounded-3xl shadow-2xl z-50
            bg-card/95 backdrop-blur-2xl text-card-foreground
            border border-border/80 divide-y divide-border/40
            animate-in fade-in zoom-in-95 duration-200 overflow-hidden
          "
        >
          {/* Header */}
          <div className="p-4 bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-black">
                    {unreadCount} UNREAD
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs text-muted-foreground hover:text-amber-500 transition-colors flex items-center gap-1 font-bold"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Quick Tabs: All vs Unread */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/40 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1 rounded-lg transition-all ${
                  activeTab === 'all'
                    ? 'bg-amber-500 text-black shadow-xs font-extrabold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('unread')}
                className={`flex-1 py-1 rounded-lg transition-all ${
                  activeTab === 'unread'
                    ? 'bg-amber-500 text-black shadow-xs font-extrabold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>
          </div>

          {/* List */}
          <ul className="max-h-88 overflow-y-auto divide-y divide-border/30">
            {displayedNotifications.length > 0 ? (
              displayedNotifications.map((notification) => {
                const display = getNotificationDisplay(notification);
                const IconComponent = display.icon;
                const isUnread = !notification.read;

                return (
                  <li
                    key={notification.id}
                    onClick={() => {
                      if (isUnread) markAsRead(notification.id);
                      setOpen(false);
                      navigate('/notifications');
                    }}
                    className={`
                      p-4 cursor-pointer transition-all duration-200 flex items-start gap-3.5
                      hover:bg-muted/50 relative group
                      ${isUnread ? 'bg-amber-500/5 dark:bg-amber-500/5' : ''}
                    `}
                  >
                    {isUnread && (
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
                    )}

                    <div className={`p-2.5 rounded-2xl shrink-0 border ${display.iconBg}`}>
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold leading-tight group-hover:text-amber-500 transition-colors ${isUnread ? 'text-foreground font-black' : 'text-foreground/80'}`}>
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
              <li className="p-10 text-center text-muted-foreground">
                <Inbox className="w-8 h-8 mx-auto mb-2 opacity-30 stroke-1" />
                <p className="text-xs font-bold text-foreground mb-0.5">All caught up!</p>
                <p className="text-[11px] opacity-70">
                  {activeTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </p>
              </li>
            )}
          </ul>

          {/* Footer */}
          <div className="p-3 bg-muted/20 text-center">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/notifications");
              }}
              className="w-full py-2.5 px-3 text-xs font-extrabold text-foreground hover:bg-amber-500 hover:text-black rounded-2xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
            >
              <span>Go to Notification Center</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
