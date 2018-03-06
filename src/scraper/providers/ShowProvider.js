import pMap from 'p-map';

import BaseProvider from './BaseProvider';

export default class ShowProvider extends BaseProvider {
  async getContent(content) {
    const { slug, episodes } = content;
    const meta = await this.helper.getMetadata(slug);

    if (meta) {
      return this.helper.addEpisodes(meta, episodes);
    }
  }

  attachTorrent({
    show,
    torrent
  }) {
    if (!show.episodes[torrent.season]) {
      show.episodes[torrent.season] = {};
    }

    if (!show.episodes[torrent.season][torrent.episode]) {
      show.episodes[torrent.season][torrent.episode] = [];
    }

    let foundTorrent = show.episodes[torrent.season][torrent.episode].find(t => t.quality === torrent.torrent.quality);
    if (!foundTorrent) {
      show.episodes[torrent.season][torrent.episode].push(torrent.torrent);
    } else if (foundTorrent.seeds < torrent.seeds) {
      foundTorrent = torrent.torrent;
    }

    return show;
  }

  async getAllContent(torrents) {
    const shows = new Map();

    await pMap(torrents, async (t) => {
      const torrent = await this.getContentData(t);

      if (!shows.has(torrent.slug)) {
        shows.set(torrent.slug, {
          slug: torrent.slug,
          episodes: {}
        });
      }

      const created = this.attachTorrent({
        show: shows.get(torrent.slug),
        torrent,
      });

      return shows.set(torrent.slug, created);
    });

    // console.dir(shows.values(), { depth: null });

    return Array.from(shows.values());
  }
}
