import React, { useState } from 'react';
import { ArrowLeft, Trash2, Check, Bell, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';

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
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-muted transition-all duration-200 hover:scale-110"
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Bell className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">Notifications</h1>
                  {unreadCount > 0 && (
                    <p className="text-sm text-primary mt-1 font-medium">
                      {unreadCount} unread
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Filter Tabs */}
          <div className="flex gap-2 bg-muted/40 p-1 rounded-lg border border-border">
            {['all', 'unread', 'read'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  filterType === type
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
                {type === 'unread' && unreadCount > 0 && (
                  <span className="ml-2 bg-destructive text-white px-2 py-0.5 rounded-full text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          {notifications.length > 0 && (
            <div className="flex gap-2 w-full sm:w-auto">
              {hasUnread && (
                <button
                  onClick={markAllAsRead}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  <Check className="h-4 w-4" />
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3 mb-8">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div key={notification.id} className="group">
                <NotificationItem
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Zap className="h-8 w-8 text-primary/60" />
                </div>
              </div>
              <p className="text-lg font-semibold text-foreground mb-2">
                {notifications.length === 0
                  ? 'No notifications yet'
                  : 'No notifications in this category'}
              </p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                {notifications.length === 0
                  ? 'Keep typing to earn achievements, improve your rank, and unlock milestones!'
                  : 'Try a different filter to find what you are looking for'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {filteredNotifications.length > 0 && (
          <div className="pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>Showing <span className="font-semibold text-foreground">{filteredNotifications.length}</span> notification{filteredNotifications.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationList;
