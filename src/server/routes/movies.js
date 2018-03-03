import { MovieService } from '../services';

module.exports = [{
  method: 'GET',
  path: '/movies',
  handler: async () =>
    MovieService.getPages()
}, {
  method: 'GET',
  path: '/movies/{page}',
  handler: async (req) => {
    const { page } = req.params;
    const {
      sort, order, genre, keywords
    } = req.query;

    const s = sort ? MovieService.sortContent({
      sort,
      order: order ? parseInt(order, 10) : -1,
      keywords: keywords && keywords !== ''
    }) : null;

    let query = {
      ...MovieService.query
    };

    if (genre && genre !== 'all') {
      query = {
        ...query,
        genres: genre.toLowerCase()
      };
    }

    if (keywords && keywords !== '') {
      query = {
        ...query,
        $text: {
          $search: keywords
        }
      };
    }

    return MovieService.getPage(page, s, query);
  }
}];
