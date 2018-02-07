import pMap from 'p-map';

import ScraperContext from './ScraperContext';
import Logger from '../util/Logger';
import providers from './providers';

export default class Scraper {
  logger = new Logger('Scraper');
  context = new ScraperContext();

  async scrape() {
    this.logger.info('Started scraping');

    const result = await pMap(
      providers,
      async ({ provider, ...config }) => this.context
        .setProvider(new provider(config))
        .execute(), 1
    );

    this.logger.info('Stopped scraping');

    return result;
  }
}
