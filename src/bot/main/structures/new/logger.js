/**
 * Creates a log4js instance with the correct level
 * @param {string} name - The name 
 * @param {string} [level] - The level, this is optional tho
 */
const createLogger = (name, level) => {
    const logger = require('log4js').getLogger(name);
    logger.level = 'info'

    return logger;
}
module.exports = {
    createLogger
}