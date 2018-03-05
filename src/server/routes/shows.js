import { ShowService } from '../services';

module.exports = [{
  method: 'GET',
  path: '/shows',
  handler: async () =>
    ShowService.getPages()
}, {
  method: 'GET',
  path: '/shows/{page}',
  handler: async (req) => {
    const { page } = req.params;
    const {
      sort, order, genre, keywords
    } = req.query;

    const s = sort ? ShowService.sortContent({
      sort,
      order: order ? parseInt(order, 10) : -1,
      keywords: keywords && keywords !== ''
    }) : null;

    let query = {
      ...ShowService.query
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

    return ShowService.getPage(page, s, query);
  }
}];
