import pMap from 'p-map';

import BaseProvider from './BaseProvider';

export default class MovieProvider extends BaseProvider {
  async getContent(content) {
    const { slug, torrents } = content;
    const meta = await this.helper.getMetadata(slug);

    if (meta) {
      return this.helper.addTorrents(meta, torrents);
    }
  }

  async getContentData() {
    throw new Error('Using default method: \'getContentData\'');
  }

  async getAllContent(torrents) {
    const movies = new Map();

    await pMap(torrents, async (torrent) => {
      const movie = await this.getContentData(torrent);

      if (!movie) return;

      // const { slug, quality, torrents } = movie;

      if (!movies.has(movie.slug)) {
        movies.set(movie.slug, movie);
      }
    });

    return Array.from(movies.values());
  }
}
