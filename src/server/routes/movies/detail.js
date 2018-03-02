import Boom from 'boom';

import { Movie } from '../../../models';

module.exports = {
  method: 'GET',
  path: '/detail/{id}',
  handler: async ({ params: { id } }) => {
    const movie = await Movie.findOne({ _id: id }).select('-__v');
    if (movie) {
      return movie;
    }
    return Boom.notFound(`Movie with imdbid ${id} is not found`);
  }
};
