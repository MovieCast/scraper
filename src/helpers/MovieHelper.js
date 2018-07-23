/* eslint-disable no-param-reassign, no-nested-ternary */

import BaseHelper from './BaseHelper';
import { trakt, tmdb, fanart } from '../Constants';
import { Movie } from '../../models';

export default class MovieHelper extends BaseHelper {
  async _updateMovie(movie) {
    try {
      const foundMovie = await Movie.findOne({ _id: movie.imdb_id });

      if (foundMovie) {
        this.logger.info(`${foundMovie.title} is an existing movie.`);

        if (foundMovie.torrents) {
          // Update torrents
        }

        return await Movie.findOneAndUpdate({
          _id: foundMovie._id
        }, movie, {
          upsert: true,
          new: true
        });
      }

      this.logger.info(`${movie.title} is a new movie!`);
      return await new Movie(movie).save();
    } catch (err) {
      this.logger.error(err);
    }
  }

  async addTorrents(movie, torrents) {
    movie.torrents = [...movie.torrents, ...torrents];

    return this._updateMovie(movie);
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

    const result = await tmdb.movie.images({
      movie_id: tmdbId
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
    return this._getTmdbImages(imdbId)
      .catch((err) => {
        this.logger.error(err);
        this.logger.warn('Failed to fetch images from TMDB, falling back to Fanart');
        this._getFanartImages(tmdbId);
      })
      .catch(() => ({ background: null, poster: null }));
  }

  async getMetadata(slug) {
    try {
      this.logger.debug(`Fetching metadata from trakt.tv for slug ${slug}`);

      const traktMovie = await trakt.movies.summary({
        id: slug,
        extended: 'full'
      });

      const traktWatchers = await trakt.movies.watching({
        id: slug
      });

      if (traktMovie && traktMovie.ids.imdb) {
        const { tmdb, imdb } = traktMovie.ids; // eslint-disable-line
        const images = await this.getImages({
          imdbId: imdb,
          tmdbId: tmdb
        });

        return {
          imdb_id: imdb,
          title: traktMovie.title,
          year: traktMovie.year,
          slug,
          synopsis: traktMovie.overview,
          runtime: traktMovie.runtime,
          rating: {
            votes: traktMovie.votes,
            watching: traktWatchers ? traktWatchers.length : 0,
            percentage: Math.round(traktMovie.rating * 10)
          },
          images,
          genres: traktMovie.genres ? traktMovie.genres : ['unknown'],
          country: traktMovie.language,
          released: new Date(traktMovie.released).getTime() / 1000.0,
          trailer: traktMovie.trailer,
          certification: traktMovie.certification,
          torrents: []
        };
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
