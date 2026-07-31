import React, { useState } from 'react';
import { ArrowLeft, Trash2, CheckCheck, Bell, Inbox, Sparkles, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';
import { AnimatePresence, motion } from 'framer-motion';

function NotificationList() {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } =
    useNotification();
  const [filterType, setFilterType] = useState('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasUnread = unreadCount > 0;

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-16 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 p-6 rounded-3xl bg-card/60 backdrop-blur-2xl border border-border/80 shadow-xl">
          <div className="flex items-center gap-4 sm:gap-5">
            <button
              onClick={() => navigate(-1)}
              className="p-3 rounded-2xl bg-muted/50 border border-border/60 hover:bg-muted hover:border-border text-muted-foreground hover:text-foreground transition-all duration-200 shadow-xs active:scale-95"
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-xs">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Notifications
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                  {hasUnread ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : "You're all caught up!"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {notifications.length > 0 && (
            <div className="flex items-center gap-2.5">
              {hasUnread && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all duration-200 flex items-center gap-1.5 border border-amber-500/20 active:scale-95"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark all read
                </button>
              )}
              <button
                onClick={clearAllNotifications}
                className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-bold transition-all duration-200 flex items-center gap-1.5 border border-destructive/20 active:scale-95"
              >
                <Trash2 className="h-4 w-4" />
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Feed Container */}
        <div className="rounded-3xl bg-card/60 backdrop-blur-2xl border border-border/80 shadow-2xl overflow-hidden">
          
          {/* Filter Bar */}
          <div className="border-b border-border/60 p-4 sm:px-6 flex items-center justify-between gap-4 bg-muted/20">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {['all', 'unread', 'read'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 ${
                    filterType === type
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {type.toUpperCase()}
                  {type === 'unread' && unreadCount > 0 && (
                    <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      filterType === type ? 'bg-black/20 text-black' : 'bg-amber-500 text-black'
                    }`}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Filter className="w-3.5 h-3.5" />
              <span>{filteredNotifications.length} items</span>
            </div>
          </div>

          {/* Notifications List */}
          <div className="p-4 sm:p-6 min-h-80">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-3.5">
                <AnimatePresence>
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                    >
                      <NotificationItem
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                <div className="p-5 rounded-2xl bg-muted/40 border border-border/60 mb-4 shadow-xs">
                  <Inbox className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {notifications.length === 0 ? "No notifications yet" : "No matches found"}
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  {notifications.length === 0
                    ? "Keep typing to earn achievements and rank up on the leaderboard! We'll notify you here."
                    : "Try selecting a different filter tab above."}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default NotificationList;
