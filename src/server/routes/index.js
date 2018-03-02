/* eslint-disable no-bitwise */

import pkg from '../../../package.json';
import Command from '../../util/Command';


module.exports = [{
  method: 'GET',
  path: '/',
  handler: async () => {
    const commit = await Command.executeCommand('git', [
      'rev-parse',
      '--short',
      'HEAD'
    ]);

    return {
      server: pkg.name,
      version: pkg.version,
      commit: commit.replace('\n', ''),
      uptime: process.uptime() | 0
    };
  }
}];
