/**
 * Express HTTP Request Logger Middleware (pino-http)
 */

const pinoHttp = require('pino-http');
const mainLogger = require('../src/logger');

const httpLoggerMiddleware = pinoHttp({
  logger: mainLogger,
  genReqId: function (req) {
    return req.id || req.headers['x-request-id'] || `req_${require('crypto').randomUUID()}`;
  },
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 500 || err) {
      return 'error';
    }
    if (res.statusCode >= 400) {
      return 'warn';
    }
    return 'info';
  },
  customProps: function (req, res) {
    const route = req.baseUrl ? `${req.baseUrl}${req.path || ''}` : (req.originalUrl || req.url || '/');
    const responseTimeMs = res.responseTimeMs || (res.getHeader && res.getHeader('x-response-time')) || undefined;

    return {
      requestId: req.id,
      method: req.method,
      route,
      ip: req.ip || req.socket?.remoteAddress || null,
      userId: req.user?.id || req.user?.userId || req.user?.email || null,
      responseTimeMs
    };
  },
  customSuccessMessage: function (req, res, responseTime) {
    const route = req.baseUrl ? `${req.baseUrl}${req.path || ''}` : (req.originalUrl || req.url || '/');
    
    // Warn if slow response (>500ms)
    if (responseTime > 500) {
      mainLogger.warn({
        requestId: req.id,
        method: req.method,
        route,
        responseTimeMs: Math.round(responseTime),
        userId: req.user?.id || req.user?.email || null
      }, 'Slow Response (>500ms)');
    }

    return `http_request_completed`;
  },
  customErrorMessage: function (req, res, err) {
    return `http_request_failed: ${err.message}`;
  }
});

module.exports = httpLoggerMiddleware;
