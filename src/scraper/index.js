import cron from 'node-cron';

import Logger from '../util/Logger';

const logger = new Logger('Scraper');

export async function start() {
    logger.info('Started scraper');
}

export async function stop() {

}