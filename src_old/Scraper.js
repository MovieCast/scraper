import cron from 'node-cron';
import pMap from 'p-map';

import ScraperContext from './ScraperContext';
import Logger, { Console } from './util/Logger';
import providers from './providers';

export default class Scraper {
  /**
   * Scraper cron task
   * @type {cron.ScheduledTask}
   */
  static task;

  /**
   * Logger intance for the Scraper
   * @type {Logger}
   */
  logger = new Logger('Scraper');

  /**
   * Scraper context to execute providers in
   * @type {ScraperContext}
   */
  context = new ScraperContext();

  running = false;

  /**
   * Start the scraper task
   * @param {boolean} force - Whether to start scraping immediately
   */
  static start(force = false) {
    if (this.task) {
      return Console.error('Scraper task is already running!');
    }

    const scraper = new Scraper();
    this.task = cron.schedule('0 0 */6 * * *', scraper.scrape.bind(scraper));
    this.task.start();
    Console.info('Scraper task started');

    if (force) {
      Console.info('Starting scrape process immediately');
      scraper.scrape();
    }
  }

  /**
   * Stop the scraper task
   */
  static stop() {
    if (!this.task) {
      return Console.error("Scraper task not running, can't stop something which ain't running!");
    }
    this.task.stop();
    this.task.destroy();
    this.logger.info('Scraper task stopped');
  }

  /**
   * Scrape through all providers
   */
  async scrape() {
    if (this.scraping) {
      return this.logger.warn('Scraper is already scraping, is the cron schedule time set correctly? Skipping request.');
    }

    this.logger.info('Started scraping');
    this.scraping = true;

    const result = await pMap(
      providers,
      ({ provider, ...config }) => this.context
        .setProvider(new provider(config))
        .execute(),
      { concurrency: 1 }
    );

    this.logger.info('Stopped scraping');
    this.scraping = false;

    return result;
  }
}
