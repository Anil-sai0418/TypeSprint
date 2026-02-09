/**
 * Date utility functions for contribution graph
 * Handles timezone-safe date operations
 */

/**
 * Get today's date in YYYY-MM-DD format (server's local date)
 * @param {string} timezone - User's timezone (not used here, but for future expansion)
 * @returns {string} YYYY-MM-DD format
 */
function getTodayDateString(timezone = 'UTC') {
  const today = new Date();
  return formatDateToString(today);
}

/**
 * Format a Date object to YYYY-MM-DD string
 * @param {Date} date - Date object to format
 * @returns {string} YYYY-MM-DD format
 */
function formatDateToString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get date range for last N days
 * @param {number} days - Number of days (default 365)
 * @returns {object} { startDate: string, endDate: string }
 */
function getDateRange(days = 365) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return {
    startDate: formatDateToString(startDate),
    endDate: formatDateToString(endDate)
  };
}

/**
 * Validate date string format
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} True if valid YYYY-MM-DD format
 */
function isValidDateString(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

/**
 * Parse date string to Date object
 * @param {string} dateStr - YYYY-MM-DD format string
 * @returns {Date} Date object
 */
function parseDateString(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

module.exports = {
  getTodayDateString,
  formatDateToString,
  getDateRange,
  isValidDateString,
  parseDateString
};
