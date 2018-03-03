import ContentService from './ContentService';
import { Movie, Show } from '../../models';

const baseProjection = {
  _id: 1,
  imdb_id: 1,
  title: 1,
  year: 1,
  genres: 1,
  images: 1,
  rating: 1,
};

const query = {
  $or: [{
    num_seasons: {
      $gt: 0
    }
  }, {
    torrents: {
      $exists: true
    }
  }]
};

export const MovieService = new ContentService({
  model: Movie,
  projection: {
    ...baseProjection,
    released: 1,
  },
  query
});

export const ShowService = new ContentService({
  model: Show,
  projection: {
    ...baseProjection,
    tvdb_id: 1,
    num_seasons: 1
  },
  query
});

