/**
 * Production-safe logging utility
 * Only logs in development or for critical errors
 */

const isDev = process.env.NODE_ENV !== 'production';

const logger = {
  // Critical errors - always log
  error: (message, error = null) => {
    console.error(`[ERROR] ${message}`, error || '');
  },

  // Warnings - only in dev
  warn: (message) => {
    if (isDev) {
      console.warn(`[WARN] ${message}`);
    }
  },

  // Info logs - only in dev
  log: (message, data = null) => {
    if (isDev) {
      console.log(`[LOG] ${message}`, data || '');
    }
  },

  // Info logs - only in dev
  info: (message, data = null) => {
    if (isDev) {
      console.info(`[INFO] ${message}`, data || '');
    }
  },

  // Debug logs - only in dev
  debug: (message, data = null) => {
    if (isDev) {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  },

  // Startup messages - always show
  startup: (message) => {
    console.log(`[STARTUP] ${message}`);
  },
};

module.exports = logger;
