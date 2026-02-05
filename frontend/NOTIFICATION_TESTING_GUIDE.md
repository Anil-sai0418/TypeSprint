# Notification System - Testing Guide

## How It Now Works

The notification system has been completely rebuilt and now includes:

### 1. **Automatic Event Detection (Auto Tracking)**
- **Leaderboard Rank Changes**: Checks every 2 minutes
  - Detects when your rank improves or declines
  - Shows notification with position change details
  
- **Streak Milestones**: Checks every 1 minute
  - Detects when streak reaches 5, 10, 15, 20+ days
  - Sends celebratory notification
  
- **Inactivity Reminders**: Checks every hour
  - Sends reminder after 24 hours of no activity

### 2. **Manual Testing in Browser Console**

Open the browser DevTools (F12 → Console tab) and run these commands:

```javascript
// Send a random test notification
window.testNotification()

// Clear all notifications
window.clearNotifications()
```

### 3. **Test Notification on Page Load**

When you visit the Home/Typing Test page, a test notification is automatically sent to verify the system is working. Look for:
- Red badge on the bell icon (top right) showing "1"
- Click the bell to see the notification dropdown
- Click "View all notifications" to see the full notifications page

## Expected Behavior

### Bell Icon (Top Right)
- Shows unread count badge (red circle with number)
- Click to see dropdown with last 5 notifications
- Recent notifications appear with proper titles/descriptions
- Click notification to mark as read
- Click "View all notifications" to see complete list

### Notifications Page (/notifications)
- Shows all notifications with filtering (All, Unread, Read)
- Each notification shows:
  - Custom icon and color based on type
  - Title and description with real data
  - Timestamp (just now, 5m ago, etc.)
  - Unread indicator (blue dot on left)
- Actions:
  - Click "Mark all as read" button
  - Click "Clear all" button
  - Individual notification actions (mark read, delete)

### Real Event Detection

#### Leaderboard Changes
1. Improve your WPM and move up in leaderboard
2. Wait up to 2 minutes
3. Should see notification: "📈 Rank Improved! You jumped X positions to rank #Y"

#### Streak Milestones
1. Build a streak and reach 5, 10, 15, etc. days
2. Wait up to 1 minute
3. Should see: "🔥 Streak Achievement! You've maintained a X-day typing streak!"

#### Inactivity Reminder
1. Don't interact with app for 24 hours
2. Should see: "🔔 We Miss You! It's been 24+ hours since your last visit"

## Files Updated

✅ `useNotificationHooks.js` - Auto-polling for rank/streak changes
✅ `useManualNotification.js` - Testing helpers (new)
✅ `notification.jsx` - Shows real notifications from context
✅ `NotificationList.jsx` - Full notifications page
✅ `NotificationItem.jsx` - Individual notification component
✅ `NotificationContext.jsx` - Global state management
✅ `Home.jsx` - Activated all tracking hooks
✅ `App.jsx` - Wrapped with NotificationProvider

## Troubleshooting

If you don't see notifications:

1. **Check console logs** (F12 → Console)
   - Look for `[Notification System] Ready for testing`
   - Look for `[TypingTest] Test notification sent`
   - Look for `[LeaderboardTracking]` or `[StreakTracking]` logs

2. **Test with manual command**
   - Run `window.testNotification()` in console
   - Should see new notification in dropdown immediately

3. **Check localStorage**
   - In console, run: `localStorage.getItem('mokey_notifications')`
   - Should show JSON array of notifications

4. **Clear and reload**
   - Run `window.clearNotifications()` in console
   - Page will reload with fresh state

5. **Verify API endpoints**
   - Make sure backend is running
   - Check that leaderboard and profile APIs return proper data

## Next Steps

Once testing is complete, we can:
1. Adjust polling intervals (currently 2min leaderboard, 1min streaks, 1hour activity)
2. Add push notifications
3. Add notification preferences/settings
4. Add toast notifications for real-time alerts
