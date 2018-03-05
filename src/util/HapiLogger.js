// Copy of Good-Console
import Hoek from 'hoek';
import SafeStringify from 'json-stringify-safe';

import Logger from './Logger';

const internals = {
  defaults: {
    name: 'Hapi'
  }
};

internals.utility = {
  formatMethod(method) {
    const methodColors = {
      get: 32,
      delete: 31,
      put: 36,
      post: 33
    };

    const color = methodColors[method.toLowerCase()] || 34;
    const formattedMethod = `\x1b[1;${color}m${method.toLowerCase()}\x1b[0m`;

    return formattedMethod;
  },

  formatStatusCode(statusCode) {
    let color;
    if (statusCode) {
      color = 32;
      if (statusCode >= 500) {
        color = 31;
      } else if (statusCode >= 400) {
        color = 33;
      } else if (statusCode >= 300) {
        color = 36;
      }

      return `\x1b[${color}m${statusCode}\x1b[0m`;
    }

    return statusCode;
  },

  formatResponse(event) {
    const query = event.query ? SafeStringify(event.query) : '';
    const method = internals.utility.formatMethod(event.method);
    const statusCode = internals.utility.formatStatusCode(event.statusCode) || '';
    const responseTime = event.info.responded - event.info.received;

    // event, timestamp, id, instance, labels, method, path, query, responseTime,
    // statusCode, pid, httpVersion, source, remoteAddress, userAgent, referer, log
    // method, pid, error
    return `HTTP ${method} ${event.path} ${query} ${statusCode} (${responseTime}ms)`;
  }
};

exports.register = async (server, options = {}) => {
  const settings = Hoek.applyToDefaults(internals.defaults, options);
  const logger = new Logger(settings.name);

  server.events.on('response', (event) => {
    logger.info(internals.utility.formatResponse(event));
  });

  server.events.on({ name: 'request', channels: ['error'] }, ({ error }) => {
    logger.error(`message: ${error.message}, stack: ${error.stack}`);
  });
};

exports.name = 'HapiLogger';
exports.version = '1.0.0';
