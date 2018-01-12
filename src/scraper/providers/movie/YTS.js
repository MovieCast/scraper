import YtsAPI from '@moviecast/yts-api';
import pTimes from 'p-times';

import BaseProvider from '../BaseProvider';
import { Movie } from '../../../models';

export default class YTS extends BaseProvider {
    constructor() {
        super('YTS', { api: new YtsAPI(), model: Movie, query: {} });
    }

    /**
     * Get all the torrents of a given torrent provider.
     * @override
     * @param {Number} totalPages - The total pages of the query.
     * @returns {Promise} - A list of all the queried
     * torrents.
     */
    async getAllTorrents(totalPages) {
        let torrents = [];

        await pTimes(totalPages, async page => {
            this.query.page = page + 1;
            
            this.logger.debug(`Started fetching page ${page + 1} out of ${totalPages}`);
            const response = await this.api.getMovies(this.query);
            const data = response.data.movies;

            torrents = [ ...torrents, ...data ];
        }, { concurrency: 1 });

        this.logger.debug(`Found ${torrents.length} torrents.`);
        return torrents;
    }

    async getTotalPages() {
        const response = await this.api.getMovies(this.query);
        return Math.ceil(response.data.movie_count / 50)
    }
}