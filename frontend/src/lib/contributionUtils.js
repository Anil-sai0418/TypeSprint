/**
 * Frontend utility functions for contribution graph
 * Handles date calculations, color mapping, and data transformation
 */

/**
 * Color thresholds for activity intensity
 * Configurable for different use cases
 */
const COLOR_CONFIG = {
  levels: [
    { min: 0, max: 0, label: 'No activity', light: 'bg-gray-100 dark:bg-gray-700/40', dark: 'bg-gray-100 dark:bg-gray-700/40' },
    { min: 1, max: 2, label: '1-2 activities', light: 'bg-green-100 dark:bg-green-900/30', dark: 'bg-green-100 dark:bg-green-900/30' },
    { min: 3, max: 4, label: '3-4 activities', light: 'bg-green-300 dark:bg-green-800/60', dark: 'bg-green-300 dark:bg-green-800/60' },
    { min: 5, max: 6, label: '5-6 activities', light: 'bg-green-500 dark:bg-green-600/80', dark: 'bg-green-500 dark:bg-green-600/80' },
    { min: 7, max: Infinity, label: '7+ activities', light: 'bg-green-600 dark:bg-green-500', dark: 'bg-green-600 dark:bg-green-500' }
  ]
};

/**
 * Get color classes based on activity count
 * @param {number} count - Activity count
 * @param {boolean} isDark - Is dark mode enabled
 * @returns {string} Tailwind CSS classes
 */
export function getActivityColor(count, isDark = false) {
  const level = COLOR_CONFIG.levels.find(l => count >= l.min && count <= l.max);
  return level ? (isDark ? level.dark : level.light) : COLOR_CONFIG.levels[0].light;
}

/**
 * Get color label for activity count
 * @param {number} count - Activity count
 * @returns {string} Human-readable label
 */
export function getActivityLabel(count) {
  const level = COLOR_CONFIG.levels.find(l => count >= l.min && count <= l.max);
  return level ? level.label : 'No data';
}

/**
 * Generate array of last 365 days with proper week structure
 * Returns: [ [week1_day1, week1_day2, ...], [week2_day1, ...], ... ]
 * Each week array has 7 elements (Monday-Sunday)
 * @returns {array} 2D array of weeks and days
 */
export function generateLast365Days() {
  const weeks = [];
  const today = new Date();
  
  // Start from the Monday of the current week
  const currentDayOfWeek = today.getDay();
  const daysSinceMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  
  // Go back to Monday of current week
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - daysSinceMonday);
  
  // Go back 52 more weeks (to start 53 weeks ago from Monday)
  startDate.setDate(startDate.getDate() - 52 * 7);
  
  // Generate 53 weeks of data
  for (let weekIdx = 0; weekIdx < 53; weekIdx++) {
    const week = [];
    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + weekIdx * 7 + dayIdx);
      
      week.push({
        date: formatDateToString(date),
        displayDate: date,
        dayOfWeek: dayIdx, // 0=Monday, 6=Sunday
        isToday: isToday(date),
        isFuture: date > today
      });
    }
    weeks.push(week);
  }
  
  return weeks;
}

/**
 * Format date to YYYY-MM-DD string
 * @param {Date} date - Date object
 * @returns {string} YYYY-MM-DD format
 */
export function formatDateToString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if a date is today
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth() &&
         date.getDate() === today.getDate();
}

/**
 * Format date for tooltip display
 * @param {string} dateStr - YYYY-MM-DD format string
 * @param {number} count - Activity count
 * @returns {string} Human-readable format
 */
export function formatTooltipText(dateStr, count) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  
  const activityText = count === 1 ? 'activity' : 'activities';
  return `${dayName}, ${monthName} ${day} · ${count} ${activityText}`;
}

/**
 * Get day of week name from index
 * @param {number} dayIdx - 0=Monday, 6=Sunday
 * @returns {string} Day name abbreviation
 */
export function getDayName(dayIdx) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days[dayIdx];
}

/**
 * Merge activity data with date grid
 * @param {array} weeks - Generated week structure
 * @param {object} activityMap - Activity data from API ({ 'YYYY-MM-DD': count })
 * @returns {array} Enhanced weeks with activity data
 */
export function mergeActivityData(weeks, activityMap) {
  return weeks.map(week =>
    week.map(day => ({
      ...day,
      activityCount: activityMap[day.date] || 0
    }))
  );
}

/**
 * Calculate contribution statistics
 * @param {object} activityMap - Activity data
 * @returns {object} Statistics
 */
export function calculateStats(activityMap) {
  const counts = Object.values(activityMap);
  
  if (counts.length === 0) {
    return {
      totalActivities: 0,
      activeDays: 0,
      maxDay: 0,
      averagePerDay: 0,
      currentStreak: 0
    };
  }
  
  const totalActivities = counts.reduce((sum, c) => sum + c, 0);
  const activeDays = counts.filter(c => c > 0).length;
  const maxDay = Math.max(...counts);
  
  return {
    totalActivities,
    activeDays,
    maxDay,
    averagePerDay: (totalActivities / activeDays).toFixed(1),
    currentStreak: 0 // Will be computed by backend if needed
  };
}

export default {
  COLOR_CONFIG,
  getActivityColor,
  getActivityLabel,
  generateLast365Days,
  formatDateToString,
  isToday,
  formatTooltipText,
  getDayName,
  mergeActivityData,
  calculateStats
};
