import pMap from 'p-map';
import pTimes from 'p-times';

import { IApi, IProvider } from '../interfaces';
import Logger from '../util/Logger';
import BaseHelper from '../helpers/BaseHelper';

/**
 * Base class for scraper providers.
 * @implements {IProvider}
 */
export default class BaseProvider extends IProvider {
    /**
     * The name of the provider.
     * @type {string}
     */
    name = null;

    /**
     * The logger of the provider.
     * @type {ILogger}
     */
    logger = null;

    /**
     * The api of the provider.
     * @type {IApi}
     */
    api = new IApi();

    /**
     * The model used by the provider.
     * @type {Object}
     */
    model = null;

    /**
     * The helper of this provider.
     * @type {BaseHelper}
     */
    helper = new BaseHelper();

    /**
     * The query object for the api.
     * @type {Object}
     */
    query = {};

    constructor({
      name, api, model, helper, query,
    }) {
      super();
      this.name = name;
      this.logger = new Logger(name);
      this.api = new api();
      this.model = model;
      this.helper = new helper();
      this.query = query;
    }

    async getContent() {
      throw new Error('Using default method: \'getContent\'');
    }

    async getAllContent() {
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

      await pTimes(totalPages, async (page) => {
        this.query.page = page + 1;

        this.logger.debug(`Started fetching page ${page + 1} out of ${totalPages}`);
        const response = await this.api.search(this.query);
        const data = response.results;

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
        this.logger.info(`Total items found: ${content.length}`);

        return pMap(content, torrent => this.getContent(torrent), { concurrency: 1 });
      } catch (err) {
        this.logger.log(err);
      }
    }
}
