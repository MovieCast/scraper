import pMap from 'p-map';

import ScraperContext from "./ScraperContext";
import YTSProvider from './providers/movie/YTSProvider';
import Logger from '../util/Logger';

export class Scraper {

    logger = new Logger('Scraper');
    context = new ScraperContext();
    providers = [new YTSProvider()];

    async scrape() {
        this.logger.info('Started scraping');
        const result = await pMap(this.providers, async provider => {
            this.context.setProvider(provider);

            return this.context.execute();
        }, 1);

        this.logger.info('Stopped scraping');

        return result;
    }
}