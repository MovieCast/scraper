import pMap from 'p-map';
import pTimes from 'p-times';

import { IApi, IProvider } from '../../interfaces';
import Logger from '../../util/Logger';

/**
 * Base class for scraper providers.
 * @implements {IProvider}
 */
export default class BaseProvider extends IProvider {
    
    /**
     * Create a BaseProvider class.
     * @param {!Object} config - The configuration object for the provider.
     * @param {!IApi} config.api - The api object for the provider.
     * @param {!Object} config.query - The query object for the api.
     */
    constructor(name, { api, model, query, helper }) {
        super();

        this.name = name;

        this.logger = new Logger(name);

        /**
         * The api of the provider.
         * @type {IApi}
         */
        this.api = api;

        /**
         * The model used by the provider
         * @type {Object}
         */
        this.model = model;

        /**
         * The query object for the api.
         * @type {Object}
         */
        this.query = query;

        /**
         * The helper of this provider
         * @type {BaseHelper}
         */
        this.helper = helper;
    }

    async getContent() {
        throw new Error('Using default method: \'getContent\'');
    }

    async getAllContent(torrents) {
        throw new Error('Using default method: \'getAllContent\'');
    }

    /**
     * Get all the torrents of a given torrent provider.
     * @override
     * @param {Number} totalPages - The total pages of the query.
     * @returns {Promise<Array<Object>, undefined>} - A list of all the queried
     * torrents.
     */
    async getAllTorrents(totalPages) {
        let torrents = [];

        await pTimes(totalPages, async page => {
            this.query.page = page + 1;
            
            this.logger.debug(`Started fetching page ${page + 1} out of ${totalPages}`);
            const response = await this.api.search(this.query);
            const data = res.results;

            torrents = { ...torrents, ...data };
        }, { concurrency: 1 });

        this.logger.debug(`Found ${torrents.length} torrents.`);
        return torrents;
    }

    async getTotalPages() {
        const response = await this.api.search(this.query);
        return response.total_pages;
    }
    
    /**
     * Returns a list of all the inserted torrents.
     * @override
     * @returns {Promise<Array<Object>, undefined>} - A list of scraped content.
     */
    async fetch() {
        try {
            const totalPages = await this.getTotalPages();

            this.logger.info(`Total pages to fetch: ${totalPages}`);

            const torrents = await this.getAllTorrents(totalPages);

            const content = await this.getAllContent(torrents);
            this.logger.info(`Total movies found: ${content.length}`);

            return await pMap(content, torrent => this.getContent(torrent), { concurrency: 50 });
        } catch(err) {
            console.error(err);
        }
    }
}