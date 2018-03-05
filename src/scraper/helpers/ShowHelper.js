import BaseHelper from './BaseHelper';

import { trakt } from '../Constants';

export default class ShowHelper extends BaseHelper {
  /**
   * Get show metadata
   * @param {string} slug - The slug to search on
   */
  async getMetadata(slug) {
    try {
      this.logger.debug(`Fetching metadata from trakt.tv for slug ${slug}`);

      const traktShow = await trakt.shows.summary({
        id: slug,
        extended: 'full'
      });

      const traktWatchers = await trakt.movies.watching({
        id: slug
      });

      if (traktShow && traktShow.ids.imdb) {
        this.logger.log(traktShow, traktWatchers);
      }
    } catch (err) {
      if (err.path) {
        this.logger.error(`Trakt: Could not find any data on: ${err.path || err} with slug: '${slug}'`);
      } else {
        this.logger.error(`Trakt: Unexpected Error occured: ${err} while fetching slug: '${slug}'`);
      }
    }
  }
}
