/**
 * Pino Custom Serializers & Sensitive Data Redaction
 */

const SENSITIVE_KEYS = [
  'password',
  'pass',
  'pwd',
  'token',
  'jwt',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'auth',
  'secret',
  'otp',
  'code',
  'creditcard',
  'cardnumber',
  'cvv',
  'cc',
  'cookie',
  'cookies',
  'set-cookie'
];

/**
 * Deeply redacts sensitive keys from an object
 */
function redactObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(redactObject);

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some(k => lowerKey.includes(k))) {
      cleaned[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      cleaned[key] = redactObject(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

const serializers = {
  req(req) {
    if (!req) return req;
    const rawReq = req.raw || req;
    const route = rawReq.baseUrl ? `${rawReq.baseUrl}${rawReq.path || ''}` : (rawReq.originalUrl || rawReq.url || '/');

    return {
      requestId: rawReq.id || rawReq.headers?.['x-request-id'] || null,
      method: rawReq.method,
      route,
      ip: rawReq.ip || rawReq.socket?.remoteAddress || null,
      userAgent: rawReq.headers?.['user-agent'] || null,
      userId: rawReq.user?.id || rawReq.user?.userId || rawReq.user?.email || null,
      query: rawReq.query ? redactObject(rawReq.query) : {},
      params: rawReq.params ? redactObject(rawReq.params) : {},
      body: rawReq.body ? redactObject(rawReq.body) : undefined,
    };
  },

  res(res) {
    if (!res) return res;
    const rawRes = res.raw || res;
    return {
      statusCode: rawRes.statusCode,
      responseTimeMs: res.responseTimeMs || rawRes.responseTimeMs || null,
      contentLength: rawRes.getHeader ? rawRes.getHeader('content-length') : undefined,
    };
  },

  err(err) {
    if (!err) return err;
    return {
      errorName: err.name || 'Error',
      errorCode: err.code || 'UNKNOWN_ERROR',
      message: err.message,
      stack: err.stack,
    };
  }
};

module.exports = {
  serializers,
  redactObject,
  SENSITIVE_KEYS
};
