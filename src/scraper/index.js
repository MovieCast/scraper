import cron from 'node-cron';

import { Console } from '../util/Logger';
import Scraper from './Scraper';

const scraper = new Scraper();

export async function start() {
  cron.schedule('0 0 */6 * * *', scraper.scrape.bind(scraper), true);
  scraper.scrape();
}

export async function stop() {
  Console.warn("Scraper can't be stopped yet sorry");
}
