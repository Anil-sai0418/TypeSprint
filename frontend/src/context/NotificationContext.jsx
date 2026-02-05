import React, { createContext, useState, useCallback, useRef, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const eventDeduplicationRef = useRef(new Map());
  const storageRef = useRef('mokey_notifications');

  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(storageRef.current);
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    }
  }, []);

  // Update localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem(storageRef.current, JSON.stringify(notifications));
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Generate deduplication key based on event type and data
  const generateDeduplicationKey = useCallback((type, data) => {
    switch (type) {
      case 'inactivity_reminder':
        return `inactivity_${data.userId}`;
      case 'leaderboard_rank_change':
        return `rank_${data.userId}_${data.newRank}`;
      case 'streak_milestone':
        return `streak_${data.userId}_${data.streakDays}`;
      default:
        return `${type}_${JSON.stringify(data)}`;
    }
  }, []);

  // Check if notification already exists (prevent duplicates)
  const isDuplicate = useCallback((type, data) => {
    const key = generateDeduplicationKey(type, data);
    const lastNotification = eventDeduplicationRef.current.get(key);

    if (!lastNotification) {
      eventDeduplicationRef.current.set(key, Date.now());
      return false;
    }

    // Allow duplicate if older than 1 hour
    const hourInMs = 60 * 60 * 1000;
    if (Date.now() - lastNotification > hourInMs) {
      eventDeduplicationRef.current.set(key, Date.now());
      return false;
    }

    return true;
  }, [generateDeduplicationKey]);

  // Add notification
  const addNotification = useCallback((type, data) => {
    if (isDuplicate(type, data)) {
      return;
    }

    const notification = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep last 50
  }, [isDuplicate]);

  // Mark as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Delete notification
  const deleteNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
