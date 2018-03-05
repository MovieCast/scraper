import pTimes from 'p-times';

import ShowProvider from '../ShowProvider';

export default class EZTVProvider extends ShowProvider {
  /**
   * Get all the torrents of a given torrent provider.
   * @override
   * @param {Number} totalPages - The total pages of the query.
   * @returns {Promise} - A list of all the queried
   * torrents.
   */
  async getAllTorrents(totalPages) {
    let torrents = [];

    await pTimes(totalPages, async (page) => {
      this.query.page = page + 1;

      this.logger.debug(`Started fetching page ${page + 1} out of ${totalPages}`);
      const response = await this.api.getTorrents(this.query);

      if (response.torrents) {
        torrents = [...torrents, ...response.torrents.filter(t => t.imdb_id !== '')];
      } else {
        this.logger.warn(`Page ${response.page}'s response.torrents is undefined, skipping page`);
      }
    }, { concurrency: 5 });

    this.logger.debug(`Found ${torrents.length} torrents.`);
    return torrents;
  }

  async getTotalPages() {
    if (process.env.NODE_ENV === 'development') return 3;

    const response = await this.api.getTorrents(this.query);
    return Math.floor(response.torrents_count / response.limit);
  }
}
