import { Schema } from 'mongoose';

import { contentSchema } from '../contentSchema';

const showSchema = {
  ...contentSchema,
  tvdb_id: Number,
  country: String,
  network: String,
  air_day: String,
  air_time: String,
  status: String,
  num_seasons: Number,
  last_updated: Number,
  lastest_episode: {
    type: Number,
    default: 0
  },
  episodes: {
    type: [{
      tvdb_id: Number,
      season: Number,
      episode: Number,
      title: String,
      overview: String,
      date_based: Boolean,
      first_aired: Number,
      torrents: []
    }]
  }
};

export default new Schema(showSchema, {
  collection: 'shows'
});
