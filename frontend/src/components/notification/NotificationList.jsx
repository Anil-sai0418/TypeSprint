import React, { useState } from 'react';
import { ArrowLeft, Trash2, Check, Bell, Zap, Inbox } from 'lucide-react';
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
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate(-1)}
              className="p-3 rounded-2xl bg-card border border-border hover:bg-muted hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all duration-300 shadow-sm hover:shadow"
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-primary/10 text-primary shadow-sm shadow-primary/5">
                <Bell className="h-7 w-7" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground/90">Notifications</h1>
                <p className="text-muted-foreground font-medium mt-0.5 text-sm">
                  {hasUnread ? `You have ${unreadCount} unread messages` : "You're all caught up!"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {notifications.length > 0 && (
            <div className="flex items-center gap-3 sm:ml-0">
              {hasUnread && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-sm font-semibold transition-all duration-300 flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Mark all read
                </button>
              )}
              <button
                onClick={clearAllNotifications}
                className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground text-sm font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
          {/* Filters */}
          <div className="border-b border-border p-4 sm:px-6 flex gap-2 overflow-x-auto no-scrollbar">
            {['all', 'unread', 'read'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shrink-0 ${
                  filterType === type
                    ? 'bg-foreground text-background shadow-md'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
                {type === 'unread' && unreadCount > 0 && (
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                    filterType === type ? 'bg-background/20 text-background' : 'bg-primary text-primary-foreground'
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="p-4 sm:p-6 min-h-100">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
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
              <div className="h-full flex flex-col items-center justify-center text-center py-20 px-4">
                <div className="p-6 rounded-full bg-muted/30 mb-6 border border-border">
                  <Inbox className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {notifications.length === 0
                    ? "It's quiet here"
                    : "No matches found"}
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  {notifications.length === 0
                    ? "Keep typing to earn achievements and unlock milestones. We'll notify you when something interesting happens!"
                    : "Try a different filter to find what you're looking for."}
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
