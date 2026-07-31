/**
 * Environment-Aware Pino Transport & Pretty Stream Configuration
 */

const pinoPretty = require('pino-pretty');

const isDev = process.env.NODE_ENV !== 'production';

function getPrettyStream() {
  if (isDev) {
    return pinoPretty({
      colorize: true,
      translateTime: 'SYS:HH:MM:ss.l',
      ignore: 'pid,hostname,service,environment',
      singleLine: true
    });
  }

  // Production: return undefined to let Pino stream NDJSON directly to stdout
  return undefined;
}

module.exports = {
  getPrettyStream
};
