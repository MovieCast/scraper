/* eslint-disable no-console */
import { isMaster } from 'cluster';
import chalk from 'chalk';
import moment from 'moment';

export default class Logger {
  constructor(name) {
    this.name = name;
  }

  /**
   * Internal function to format logs
   * @param {*} level - The log level
   * @param {*} color - The level color
   * @param {*} msg - The message to log
   * @private
   */
  _formattedLog(level, color, msg) {
    const pidColor = isMaster ? chalk.blue : chalk.yellow;
    console.log(chalk.dim(`[${moment().format('YYYY/MM/DD HH:MM:ss')}]`), color(level.padStart(5)), `${this.name}/${pidColor(process.pid)}:`, chalk.dim(msg));
  }

  info(msg) {
    this._formattedLog('INFO', chalk.green, msg);
  }

  debug(msg) {
    this._formattedLog('DEBUG', chalk.cyan, msg);
  }

  warn(msg) {
    this._formattedLog('WARN', chalk.yellow, msg);
  }

  error(msg) {
    this._formattedLog('ERROR', chalk.red, msg);
  }

  /**
   * A wrapper to the normal console.log
   * @param {*} msg - The message to log
   */
  log(msg) {
    console.log(msg);
  }
}

export const Console = new Logger('Console');
