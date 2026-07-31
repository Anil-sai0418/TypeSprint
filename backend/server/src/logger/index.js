/**
 * Centralized Pino Logger Instance
 */

const pino = require('pino');
const { getPrettyStream } = require('./transport');
const { serializers } = require('./serializers');

const isDev = process.env.NODE_ENV !== 'production';

const pinoConfig = {
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  base: {
    service: process.env.SERVICE_NAME || 'monkey-type-backend',
    environment: process.env.NODE_ENV || 'development'
  },
  timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() })
  },
  serializers: {
    req: serializers.req,
    res: serializers.res,
    err: serializers.err
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers["set-cookie"]',
      'req.body.password',
      'req.body.pass',
      'req.body.token',
      'req.body.jwt',
      'req.body.accessToken',
      'req.body.refreshToken',
      'req.body.otp',
      'req.body.creditCard',
      'req.body.cardNumber',
      'req.body.cvv',
      '*.password',
      '*.token',
      '*.jwt',
      '*.accessToken',
      '*.refreshToken',
      '*.otp',
      '*.creditCard',
      '*.cvv',
      '*.authorization',
      '*.cookie'
    ],
    censor: '[REDACTED]'
  }
};

const prettyStream = getPrettyStream();
const mainLogger = prettyStream ? pino(pinoConfig, prettyStream) : pino(pinoConfig);

module.exports = mainLogger;
