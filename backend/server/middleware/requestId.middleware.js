/**
 * Express Middleware to bind or generate unique X-Request-ID per HTTP request
 */

const crypto = require('crypto');

function requestIdMiddleware(req, res, next) {
  const existingId = req.headers['x-request-id'] || req.headers['x-correlation-id'];
  const requestId = existingId ? String(existingId) : `req_${crypto.randomUUID()}`;

  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);

  next();
}

module.exports = requestIdMiddleware;
