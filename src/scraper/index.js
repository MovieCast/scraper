import cron from 'node-cron';

import YTS from './providers/movie/YTSProvider';
import Logger from '../util/Logger';

const logger = new Logger('Scraper');

const yts = new YTS();

export async function start() {
    logger.info('Started scraper');
    const result = await yts.fetch();

    console.dir(result, { depth: null });
    logger.info(`Result: ${result.length}`);
}

export async function stop() {

}