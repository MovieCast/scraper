/* eslint-disable no-bitwise */

import pkg from '../../../package.json';

module.exports = [{
  method: 'GET',
  path: '/',
  handler: () => ({
    server: pkg.name,
    version: pkg.version,
    uptime: process.uptime() | 0,
  })
}];
