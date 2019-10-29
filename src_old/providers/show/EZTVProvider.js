import pTimes from 'p-times';

import ShowProvider from '../ShowProvider';

export default class EZTVProvider extends ShowProvider {
  async getContentData(torrent) {
    const {
      imdb_id, title, season, episode, hash, seeds, peers, size_bytes
    } = torrent;

    const quality = title.match(/(\d{3,4})p/) !== null
      ? title.match(/(\d{3,4})p/)[0]
      : '480p';

    return {
      slug: `tt${imdb_id}`,
      season,
      episode,
      torrent: {
        hash,
        seeds: seeds || 0,
        peers: peers || 0,
        size: size_bytes,
        quality,
        provider: this.name
      }
    };

    // const show = {
    //   slug: imdb_id,
    //   season,
    //   episode,
    //   episodes: []
    // };

    // show.episodes.push({
    //   torrents: [{
    //     hash: torrent.hash,
    //     seeds: torrent.seeds || 0,
    //     peers: torrent.peers || 0,
    //     size: torrent.size_bytes,
    //     quality: 'unknown',
    //     provider: this.name
    //   }],
    //   season: torrent.season,
    //   episode: torrent.episode,

    // });

    // return this.attachTorrent({
    //   show,
    //   season,
    //   episode,
    //   quality,
    //   torrent: torrentObj
    // });
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
    return Math.ceil(response.torrents_count / response.limit);
  }
}
