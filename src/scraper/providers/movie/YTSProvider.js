import pTimes from 'p-times';

import MovieProvider from '../MovieProvider';

export default class YTSProvider extends MovieProvider {
  async getContentData(torrent) {
    if (
      torrent && torrent.torrents &&
            torrent.imdb_code &&
            torrent.language.match(/english/i)
    ) {
      const movie = {
        title: torrent.title,
        slug: torrent.imdb_code,
        year: torrent.year,
        torrents: {}
      };

      for (let i = 0; i < torrent.torrents.length; i++) {
        const {
          hash, quality, peers, seeds, size, size_bytes
        } = torrent.torrents[i];

        if (!movie.torrents[quality]) {
          movie.torrents[quality] = {
            hash,
            seeds: seeds || 0,
            peers: peers || 0,
            size: size_bytes,
            fileSize: size,
            provider: this.name
          };
        }
      }

      return movie;
    }
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

    await pTimes(totalPages, async (page) => {
      this.query.page = page + 1;

      this.logger.debug(`Started fetching page ${page + 1} out of ${totalPages}`);
      const response = await this.api.getMovies(this.query);

      if (response.data.movies) {
        const data = response.data.movies;

        torrents = [...torrents, ...data];
      } else {
        this.logger.warn(`Page ${response.data.page_number}'s response.data.movies is undefined, skipping page`);
      }
    }, { concurrency: 10 });

    this.logger.debug(`Found ${torrents.length} torrents.`);
    return torrents;
  }

  async getTotalPages() {
    const response = await this.api.getMovies(this.query);
    return Math.ceil(response.data.movie_count / this.query.limit);
  }
}
