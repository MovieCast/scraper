import pMap from 'p-map';

import ScraperContext from "./ScraperContext";
import YTSProvider from './providers/movie/YTSProvider';
import Logger from '../util/Logger';
import providers from './providers';

export class Scraper {

    logger = new Logger('Scraper');
    context = new ScraperContext();

    async scrape() {
        this.logger.info('Started scraping');
        const result = await pMap(providers, async ({provider, ...config}) => {
            console.log(provider, config);
            const providerInstance = new provider();
            console.log(providerInstance);
            providerInstance.initialize(config);

            this.context.setProvider(providerInstance);

            return this.context.execute();
        }, 1);

        this.logger.info('Stopped scraping');

        return result;
    }
}