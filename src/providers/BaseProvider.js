import IProvider from './IProvider';
import IApi from '../apis/IApi';

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
    constructor({ api, model, query }) {
        super();

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
    }

    getContent() {
        throw new Error(`Using default method: 'getContent'`);
    }

    /**
     * Get all the torrents of a given torrent provider.
     * @override
     * @param {Number} totalPages - The total pages of the query.
     * @returns {Promise<Array<Object>, undefined>} - A list of all the queried
     * torrents.
     */
    async getAllData(totalPages) {
        
    }
    
    /**
     * Returns a list of all the inserted torrents.
     * @override
     * @returns {Promise<Array<Object>, undefined>} - A list of scraped content.
     */
    async fetch() {
        try {
            const firstSearch = await this.api.search(this.query);

            // Calculate the total pages needed to be fetched
            const totalPages = process.env.NODE_ENV === 'development'
                ? 3 : firstSearch.total_pages
                    ? firstSearch.total_pages : Math.ceil(firstSearch.data.movie_count / 50);

            console.log(`Calculated total pages: ${totalPages}`);



        } catch(err) {
            console.error(err);
        }
    }
}