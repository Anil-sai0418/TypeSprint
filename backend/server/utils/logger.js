/**
 * Enterprise Logger Utility Facade
 */

const mainLogger = require('../src/logger');

const logger = {
  // Underlying Pino Logger instance
  pino: mainLogger,

  // Standard log methods
  info(msg, meta = {}) {
    if (typeof msg === 'object') {
      mainLogger.info(msg, meta);
    } else {
      mainLogger.info(meta, msg);
    }
  },

  warn(msg, meta = {}) {
    if (typeof msg === 'object') {
      mainLogger.warn(msg, meta);
    } else {
      mainLogger.warn(meta, msg);
    }
  },

  debug(msg, meta = {}) {
    if (typeof msg === 'object') {
      mainLogger.debug(msg, meta);
    } else {
      mainLogger.debug(meta, msg);
    }
  },

  error(err, meta = {}) {
    if (err instanceof Error) {
      mainLogger.error({
        err,
        errorName: err.name || 'Error',
        errorCode: err.code || 'UNKNOWN_ERROR',
        message: err.message,
        stack: err.stack,
        ...meta
      }, err.message);
    } else if (typeof err === 'object') {
      mainLogger.error(err, meta || err.msg || err.message || 'An error occurred');
    } else {
      mainLogger.error(meta, String(err));
    }
  },

  // Auth Category Logging
  auth: {
    loginAttempt(meta = {}) {
      mainLogger.info({ ...meta, category: 'AUTH' }, 'user_login_attempt');
    },
    loginSuccess(meta = {}) {
      mainLogger.info({ ...meta, category: 'AUTH' }, '✔ User login successful');
    },
    loginFailure(meta = {}) {
      mainLogger.warn({ ...meta, category: 'AUTH' }, 'user_login_failure');
    },
    logout(meta = {}) {
      mainLogger.info({ ...meta, category: 'AUTH' }, 'user_logout');
    },
    refreshToken(meta = {}) {
      mainLogger.info({ ...meta, category: 'AUTH' }, 'refresh_token_issued');
    },
    jwtVerification(meta = {}) {
      mainLogger.debug({ ...meta, category: 'AUTH' }, 'jwt_verification');
    },
    permissionDenied(meta = {}) {
      mainLogger.warn({ ...meta, category: 'AUTH' }, 'permission_denied');
    },
    invalidToken(meta = {}) {
      mainLogger.warn({ ...meta, category: 'AUTH' }, 'invalid_token');
    },
    expiredToken(meta = {}) {
      mainLogger.warn({ ...meta, category: 'AUTH' }, 'expired_token');
    }
  },

  // Database Category Logging
  db: {
    connected(meta = {}) {
      mainLogger.info({ ...meta, category: 'DATABASE' }, 'Database Connected');
    },
    reconnected(meta = {}) {
      mainLogger.info({ ...meta, category: 'DATABASE' }, 'Database Reconnected');
    },
    queryFailed(err, meta = {}) {
      mainLogger.error({ ...meta, category: 'DATABASE', err }, 'Database Query Failed');
    },
    transactionStarted(meta = {}) {
      mainLogger.debug({ ...meta, category: 'DATABASE' }, 'Transaction Started');
    },
    transactionCommitted(meta = {}) {
      mainLogger.debug({ ...meta, category: 'DATABASE' }, 'Transaction Committed');
    },
    transactionRolledBack(meta = {}) {
      mainLogger.warn({ ...meta, category: 'DATABASE' }, 'Transaction Rolled Back');
    }
  },

  // Child logger helper
  child(bindings = {}) {
    return mainLogger.child(bindings);
  }
};

module.exports = logger;
