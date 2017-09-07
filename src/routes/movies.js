import Boom from 'boom';
import { Movie } from '../models';

module.exports = [{
    method: 'GET',
    path: '/movies',
    handler: (request, reply) => {
        Movie.count({}).exec().then(totalMovies => {
            reply({
                totalPages: Math.ceil(totalMovies / config.endpoints.movies.moviesPerPage),
                totalResults: totalMovies,
                resultsPerPage: config.endpoints.movies.moviesPerPage
            });
        }).catch(err => {
            Boom.internal(err);
        })
    }
}]