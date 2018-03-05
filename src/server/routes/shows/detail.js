import Boom from 'boom';

import { Show } from '../../../models';

module.exports = {
  method: 'GET',
  path: '/detail/{id}',
  handler: async ({ params: { id } }) => {
    const show = await Show.findOne({ _id: id }).select('-__v');
    if (show) {
      return show;
    }
    return Boom.notFound(`Show with imdbid ${id} is not found`);
  }
};
