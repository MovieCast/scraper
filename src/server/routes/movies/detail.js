import { Movie } from '../../../models/index';

module.exports = {
  method: 'GET',
  path: '/detail/{id}',
  handler: async (request) => {
    const movie = await Movie.findOne({ _id: request.params.id }).select('-__v');

    return movie;
  }
};
