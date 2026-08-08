import React, { useState, useMemo } from 'react';
import { ArrowLeft, Trash2, CheckCheck, Bell, Inbox, Sparkles, Search, Trophy, TrendingUp, Flame, Clock, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';
import { AnimatePresence, motion } from 'framer-motion';

function NotificationList() {
  const navigate = useNavigate();
  const { notifications, addNotification, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } =
    useNotification();
  
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const hasUnread = unreadCount > 0;

  // Filter categories definition
  const categories = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'unread', label: 'Unread', icon: Bell, count: unreadCount },
    { id: 'achievement_unlocked', label: 'Achievements 🏆', icon: Trophy },
    { id: 'leaderboard_rank_change', label: 'Leaderboard 📈', icon: TrendingUp },
    { id: 'streak_milestone', label: 'Streaks 🔥', icon: Flame },
    { id: 'inactivity_reminder', label: 'Reminders 🔔', icon: Clock },
  ];

  // Filtered and searched notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Category filter
      if (filterCategory === 'unread' && n.read) return false;
      if (filterCategory !== 'all' && filterCategory !== 'unread' && n.type !== filterCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const dataStr = JSON.stringify(n.data || {}).toLowerCase();
        const typeStr = (n.type || '').toLowerCase();
        return dataStr.includes(query) || typeStr.includes(query);
      }
      return true;
    });
  }, [notifications, filterCategory, searchQuery]);

  // Demo Notification Trigger for user testing
  const handleSimulateDemoNotification = () => {
    const demoTypes = [
      {
        type: 'achievement_unlocked',
        data: { userId: 'demo', achievementId: '100 WPM Club' }
      },
      {
        type: 'leaderboard_rank_change',
        data: { userId: 'demo', previousRank: 12, newRank: 5, improvement: true, positionsChanged: 7 }
      },
      {
        type: 'streak_milestone',
        data: { userId: 'demo', streakDays: 14 }
      }
    ];

    const randomDemo = demoTypes[Math.floor(Math.random() * demoTypes.length)];
    addNotification(randomDemo.type, randomDemo.data);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Modern Glass Dashboard Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-card/70 backdrop-blur-2xl border border-border/80 p-6 sm:p-8 shadow-2xl">
          {/* Ambient Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-3 rounded-2xl bg-muted/60 border border-border/70 hover:bg-muted hover:border-border text-muted-foreground hover:text-foreground transition-all duration-200 shadow-xs active:scale-95 shrink-0"
                title="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                    Notification Center
                  </h1>
                  {unreadCount > 0 && (
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-black tracking-wider uppercase shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-pulse">
                      {unreadCount} UNREAD
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
                  Stay updated on your achievements, leaderboard shifts, and daily speed streaks.
                </p>
              </div>
            </div>

            {/* Quick Global Action Header Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <button
                type="button"
                onClick={handleSimulateDemoNotification}
                className="px-3.5 py-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 text-xs font-bold transition-all border border-purple-500/20 flex items-center gap-1.5 active:scale-95"
                title="Simulate a test notification"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Test Alert</span>
              </button>

              {hasUnread && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all border border-amber-500/20 flex items-center gap-1.5 active:scale-95"
                >
                  <CheckCheck className="h-4 w-4" />
                  <span>Mark All Read</span>
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllNotifications}
                  className="px-3.5 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-bold transition-all border border-destructive/20 flex items-center gap-1.5 active:scale-95"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar Container */}
        <div className="rounded-3xl bg-card/60 backdrop-blur-2xl border border-border/80 shadow-2xl p-4 sm:p-6 space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted/40 border border-border/70 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-muted-foreground/60"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="text-xs font-semibold text-muted-foreground/80">
              Showing <span className="text-foreground font-bold">{filteredNotifications.length}</span> of <span className="text-foreground font-bold">{notifications.length}</span> notifications
            </div>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
            {categories.map((cat) => {
              const isActive = filterCategory === cat.id;
              const Icon = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilterCategory(cat.id)}
                  className={`
                    relative px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-2 active:scale-95
                    ${isActive
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25 font-black'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/40'
                    }
                  `}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  {cat.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-black/20 text-black' : 'bg-amber-500 text-black'
                    }`}>
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Notifications Feed */}
          <div className="pt-2 min-h-80">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.22 }}
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
              /* Empty State */
              <div className="flex flex-col items-center justify-center text-center py-20 px-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4 shadow-xl shadow-amber-500/5 animate-pulse">
                  <Inbox className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-1.5">
                  {notifications.length === 0 ? "No Notifications Yet" : "No Matching Notifications"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed mb-6">
                  {notifications.length === 0
                    ? "Complete speed tests, break personal WPM records, and unlock achievements to earn badges right here."
                    : "No notifications match your search or filter tab. Try clearing the search query."}
                </p>
                
                {notifications.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => navigate('/home')}
                    className="px-6 py-2.5 rounded-2xl bg-amber-500 text-black font-extrabold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                  >
                    Start Speed Test ⚡
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setFilterCategory('all');
                      setSearchQuery('');
                    }}
                    className="px-5 py-2 rounded-2xl bg-muted border border-border text-foreground font-bold text-xs hover:bg-muted/80 transition-all"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default NotificationList;
