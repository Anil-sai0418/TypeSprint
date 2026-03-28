import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useNotification } from '../../context/NotificationContext';
import { ACHIEVEMENTS_CONFIG } from '../../config/achievements';

const Notification = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead } = useNotification();

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

  // Get display text for notification
  const getNotificationDisplay = (notification) => {
    const { type, data } = notification;
    
    switch (type) {
      case 'inactivity_reminder':
        return {
          title: '🔔 We Miss You!',
          desc: `It's been ${data.hoursInactive || 24} hours since your last visit`
        };
      case 'leaderboard_rank_change':
        {
          const isImprovement = Boolean(data.improvement);
          const previousRank = data.previousRank;
          const newRank = data.newRank;
          const positions = data.positionsChanged || 0;

          return {
            title: isImprovement ? '📈 Leaderboard Rise' : '📉 Leaderboard Update',
            desc: isImprovement
              ? `Moved up ${positions} spot${positions > 1 ? 's' : ''}: #${previousRank} → #${newRank}`
              : `Rank changed: #${previousRank} → #${newRank}`
          };
        }
      case 'achievement_unlocked':
        {
          const achievement = getAchievementMeta(data.achievementId);
          return {
            title: '🏆 Achievement Unlocked',
            desc: achievement
              ? `${achievement.title} · ${achievement.subtitle}`
              : `You unlocked: ${data.achievementId}`
          };
        }
      case 'streak_milestone':
        return {
          title: '🔥 Streak Achievement!',
          desc: `You've maintained a ${data.streakDays}-day typing streak!`
        };
      default:
        return {
          title: 'Notification',
          desc: 'You have a new notification'
        };
    }
  };

  // Show recent notifications (max 5)
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative flex items-center justify-center p-2" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-xl transition-all duration-300 group
                   bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground
                   border border-border shadow-sm"
      >
        <Bell className="h-5 w-5 transition-transform group-active:scale-90" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-14 w-88 max-w-[90vw] rounded-xl shadow-xl z-50
                     bg-popover text-popover-foreground
                     border border-border
                     animate-in fade-in zoom-in-95"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 inline-block bg-destructive text-white px-2 py-0.5 rounded-full text-xs">
                  {unreadCount}
                </span>
              )}
            </h3>
          </div>

          {/* Notification List */}
          <ul className="max-h-72 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => {
                const display = getNotificationDisplay(notification);
                return (
                  <li
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`px-4 py-3 cursor-pointer transition-colors border-b border-border last:border-b-0
                                 ${notification.read 
                                   ? 'hover:bg-accent/50' 
                                   : 'bg-primary/10 hover:bg-primary/15'}
                                 relative`}
                  >
                    {!notification.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    )}
                    <p className="text-sm font-medium text-foreground">
                      {display.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {display.desc}
                    </p>
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-6 text-center text-muted-foreground">
                <p className="text-sm">No notifications yet</p>
              </li>
            )}
          </ul>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-border text-center">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/notifications");
              }}
              className="text-sm font-medium text-primary hover:underline"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;
