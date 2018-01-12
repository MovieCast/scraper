import cron from 'node-cron';

import YTS from './providers/movie/YTS';
import Logger from '../util/Logger';

const logger = new Logger('Scraper');

const yts = new YTS();

export async function start() {
    logger.info('Started scraper');
    await yts.fetch();
}

export async function stop() {

}