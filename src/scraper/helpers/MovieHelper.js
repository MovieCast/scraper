import BaseHelper from "./BaseHelper";
import { trakt, tmdb, fanart } from '../Constants';

export default class MovieHelper extends BaseHelper {

    async _getTmdbImages(tmdbId) {
        const i = await tmdb.movie.images({
            movie_id: tmdbId
        });
        const baseUrl = 'http://image.tmdb.org/t/p/'

        const tmdbPoster = i.posters.filter(
            poster => poster.iso_639_1 === 'en' || poster.iso_639_1 === null
        )[0].file_path;
        const tmdbBackdrop = i.backdrops.filter(
            backdrop => backdrop.iso_639_1 === 'en' || backdrop.iso_639_1 === null ||
                        backdrop.height >= 1080 || backdrop.height >= 720
        )[0].file_path;

        return {
            background: `${baseUrl}w1280${tmdbBackdrop}`,
            poster: `${baseUrl}w500${tmdbPoster}`
        }
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
        }
    }

    getImages({ imdbId, tmdbId }) {
        return this._getTmdbImages(imdbId)
            .catch(() => this._getFanartImages(tmdbId))
            .catch(() => ({ banner: null, fanart: null, poster: null }))
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
                const { tmdb, imdb, slug } = traktMovie.ids;
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
                    language: traktMovie.language,
                    released: new Date(traktMovie.released).getTime() / 1000.0,
                    trailer: traktMovie.trailer,
                    certification: traktMovie.certification,
                    torrents: {}
                }
            }
        } catch (err) {
            console.log(err);
            if (err.path) {
                this.logger.error(`Trakt: Could not find any data on: ${err.path || err} with slug: '${slug}'`);
            } else {
                console.log(err);
                this.logger.error(`Trakt: Unexpected Error occured: ${err} while fetching slug: '${slug}'`);
            }
        }
    }
}