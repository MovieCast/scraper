/* eslint-disable global-require */
import config from 'config';
import Hapi from 'hapi';
import path from 'path';

import Logger from '../util/Logger';

const logger = new Logger('API');

const server = new Hapi.Server({
  host: config.server.host,
  port: config.server.port,
  router: {
    stripTrailingSlash: true
  },
  routes: {
    cors: true
  },
  state: {
    strictHeader: false
  }
});

export async function start() {
  await server.register({
    plugin: require('good'),
    options: {
      ops: {
        interval: 30000
      },
      reporters: {
        myConsoleReporter: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            log: '*', error: '*', response: '*', request: '*', ops: '*'
          }]
        }, {
          module: 'good-console',
          args: [{
            format: 'YYYY/MM/DD HH:mm:ss'
          }]
        }, 'stdout']
      }
    }
  });

  await server.register({
    plugin: require('@moviecast/hapi-endpoint'),
    options: {
      path: path.join(__dirname, './routes')
    }
  });

  // Start the hapi server
  await server.start();

  return logger.info(`Server running at: ${server.info.uri}`);
}

export async function stop() {
  return server.stop();
}
