import pMap from 'p-map';

import BaseHelper from './BaseHelper';

import { trakt, tmdb, fanart } from '../Constants';
import { Show } from '../../models';

export default class ShowHelper extends BaseHelper {
  async updateNumSeasons(show) {
    const found = await Show.findOneAndUpdate({
      _id: show.imdb_id
    }, new Show(show), {
      new: true,
      upsert: true
    });

    const distinct = await Show.distinct('episodes.season', {
      _id: found.imdb_id
    });

    found.num_seasons = distinct.length;

    return Show.findOneAndUpdate({
      _id: found.imdb_id
    }, new Show(found), {
      new: true,
      upsert: true
    });
  }

  async updateEpisodes(show) {
    const found = await Show.findOne({
      _id: show.imdb_id
    });

    if (!found) {
      this.logger.info(`'${show.title}' is a new show!`);
      const newShow = await new Show(show).save();
      return this.updateNumSeasons(newShow);
    }

    this.logger.info(`'${show.title}' is an existing show.`);

    found.episodes.map((e) => {
      const matching = show.episodes.find(a => a.season === e.season && a.episode === e.episode);

      if (e.first_aired > show.latest_episode) {
        show.latest_episode = e.first_aired;
      }

      if (!matching) {
        return show.episodes.push(e);
      }

      // TODO: Update torrents of episodes
    });

    return this.updateNumSeasons(show);
  }

  /**
   * Add season to TraktShow.
   * @param {TraktShow} - The TraktShow
   * @param {number} - The season number
   * @param {Array<Object>} - The episodes of this season
   */
  async addSeason(show, season, episodes) {
    try {
      const traktEpisodes = await trakt.seasons.season({
        id: show.slug,
        season,
        extended: 'full'
      });

      // if (traktEpisodes) {
      traktEpisodes.map((e) => {
        if (!episodes[season][e.number]) {
          return;
        }

        const episode = {
          tvdb_id: parseInt(e.ids.tvdb, 10),
          season: parseInt(e.season, 10),
          episode: parseInt(e.number, 10),
          title: e.title,
          overview: e.overview,
          first_aired: new Date(e.first_aired).getTime() / 1000.0,
          torrents: episodes[season][e.number]
        };

        if (episode.first_aired > show.latest_episode) {
          show.latest_episode = episode.first_aired;
        }

        return show.episodes.push(episode);
      });
      // }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Add episodes to TraktShow
   * @param {TraktShow} show - The TraktShow
   * @param {Array<Object>} episodes - The episodes to add
   */
  async addEpisodes(show, episodes) {
    await pMap(Object.keys(episodes), season => this.addSeason(show, season, episodes));
    return this.updateEpisodes(show);
  }

  /**
   * Get the images of given movie.
   * @param {string} tmdbId - The tmdb movie id.
   */
  async _getTmdbImages(tmdbId) {
    // A little util function which should
    // be moved elsewere sometime.
    function getPath(path, size) {
      return `http://image.tmdb.org/t/p/${size}${path}`;
    }

    const result = await tmdb.tv.images({
      tv_id: tmdbId
    });

    const posters = result.posters.filter(i => i.iso_639_1 === 'en' || i.iso_639_1 === null);
    const backdrops = result.backdrops.filter(i => i.iso_639_1 === 'en' || i.iso_639_1 === null);

    // Sorry for the following return statement...I really am :(
    return {
      background: backdrops.length > 0 ? getPath(backdrops[0].file_path, backdrops[0].height >= '1080' ? 'original' : 'w1280') : null,
      poster: posters.length > 0 ? getPath(posters[0].file_path, 'w342') : null,
    };
  }

  async _getFanartImages(tmdbId) {
    const i = await fanart.movies.get(tmdbId);

    return {
      background: i.moviebackground
        ? i.moviebackground[0].url
        : i.hdmovieclearart
          ? i.hdmovieclearart[0].url
          : null,
      poster: i.movieposter ? i.movieposter[0].url : null
    };
  }

  getImages({ imdbId, tmdbId }) {
    return this._getTmdbImages(tmdbId)
      .catch((err) => {
        this.logger.error(err);
        this.logger.warn('Failed to fetch images from TMDB, falling back to Fanart');
        // this._getFanartImages(tmdbId);
        return { background: null, poster: null };
      })
      .catch(() => ({ background: null, poster: null }));
  }

  /**
   * Get show metadata
   * @param {string} slug - The slug to search on
   */
  async getMetadata(id) {
    try {
      const traktShow = await trakt.shows.summary({
        id,
        extended: 'full'
      });
      const traktWatchers = await trakt.shows.watching({ id });

      if (!traktShow) {
        return this.logger.warn(`No show found for slug: '${id}'`);
      }

      const { ids } = traktShow;
      const {
        imdb, tmdb, slug, tvdb
      } = ids;
      if (!imdb || !tmdb || !tvdb) {
        return this.logger.warn(`No ids found for slug: '${id}'`);
      }

      const images = await this.getImages({
        tmdbId: tmdb,
        tvdbId: tvdb
      });

      return {
        imdb_id: imdb,
        title: traktShow.title,
        year: traktShow.year,
        slug,
        synopsis: traktShow.overview,
        runtime: traktShow.runtime,
        rating: {
          votes: traktShow.votes,
          watching: traktWatchers ? traktWatchers.length : 0,
          percentage: Math.round(traktShow.rating * 10)
        },
        images,
        genres: traktShow.genres ? traktShow.genres : ['unknown'],
        tvdb_id: tvdb,
        country: traktShow.country,
        network: traktShow.network,
        air_day: traktShow.airs.day,
        air_time: traktShow.airs.time,
        status: traktShow.status,
        num_seasons: 0,
        last_updated: Number(new Date()),
        latest_episode: 0,
        episodes: []
      };
    } catch (err) {
      this.logger.error(`Trakt: Could not find any data on: ${err.path || err} with slug: '${id}'`);
    }
  }
}
