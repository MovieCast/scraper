import { Schema } from 'mongoose';

import { contentSchema } from '../contentSchema';

const movieSchema = {
  ...contentSchema,
  language: {
    type: String,
    default: 'en'
  },
  released: Number,
  trailer: {
    type: String,
    default: null
  },
  certification: String,
  torrents: []
};

export default new Schema(movieSchema, {
  collection: 'movies'
});
