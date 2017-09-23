import BaseProvider from '../BaseProvider';
import YtsAPI from '@moviecast/yts-api';
import { Movie } from '../../models';

export default class YTS extends BaseProvider {
    constructor() {
        super({ api: new YtsAPI(), model: Movie });
    }

    /**
     * Returns a list of all the inserted torrents.
     * @override
     * @returns {Promise<Array<Object>, undefined>} - A list of scraped content.
     */
    async fetch() {
        try {
            const firstSearch = await this.api.getMovies(this.query);

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