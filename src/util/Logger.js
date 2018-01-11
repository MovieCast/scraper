import Chalk from 'chalk';
import moment from 'moment';

export default class Logger {
    constructor(name) {
        this.name = name;
    }

    _getTime() {
        return moment().format('YYYY/MM/DD HH:MM:ss');
    }

    info = (msg) => {
        console.log(Chalk.dim(`[${this._getTime()}]`), Chalk.green(`${this.name}/INFO:`), Chalk.dim(msg));
    }

    debug = (msg) => {
        console.log(Chalk.dim(`[${this._getTime()}]`), Chalk.cyan(`${this.name}/DEBUG:`), Chalk.dim(msg));
    }

    warn = (msg) => {
        console.log(Chalk.dim(`[${this._getTime()}]`), Chalk.yellow(`${this.name}/WARN:`), Chalk.dim(msg));
    }

    error = (msg) => {
        console.log(Chalk.dim(`[${this._getTime()}]`), Chalk.red(`${this.name}/ERROR:`), Chalk.dim(msg));
    }
};