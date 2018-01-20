import cron from 'node-cron';

import Logger from '../util/Logger';
import { Scraper } from './Scraper';

const scraper = new Scraper();

export async function start() {
    cron.schedule('0 0 */6 * * *', scraper.scrape, true);
    scraper.scrape();
}

export async function stop() {

}