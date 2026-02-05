import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useNotification } from '../../context/NotificationContext';

const Notification = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead } = useNotification();

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
        return {
          title: data.improvement ? '📈 Rank Improved!' : '📉 Rank Update',
          desc: data.improvement 
            ? `You jumped ${data.positionsChanged} position${data.positionsChanged > 1 ? 's' : ''} to rank #${data.newRank}`
            : `You're now at rank #${data.newRank}`
        };
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
    <div className="relative flex items-center justify-center p-4" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl transition-all duration-300 group
                   bg-gray-100 text-gray-600 hover:bg-gray-200 
                   dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 
                   border border-gray-200 dark:border-zinc-700"
      >
        <Bell className="h-5 w-5 transition-transform group-active:scale-90" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-14 w-80 rounded-xl shadow-xl z-50
                     bg-white dark:bg-zinc-900
                     border border-gray-200 dark:border-zinc-700
                     animate-in fade-in zoom-in-95"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 inline-block bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
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
                    className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-zinc-800 last:border-b-0
                                 ${notification.read 
                                   ? 'hover:bg-gray-50 dark:hover:bg-zinc-800' 
                                   : 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'}
                                 relative`}
                  >
                    {!notification.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                    )}
                    <p className="text-sm font-medium text-gray-700 dark:text-zinc-200">
                      {display.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                      {display.desc}
                    </p>
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-6 text-center text-gray-500 dark:text-zinc-400">
                <p className="text-sm">No notifications yet</p>
              </li>
            )}
          </ul>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-zinc-800 text-center">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/notifications");
              }}
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
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
