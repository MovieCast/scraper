import mongoose from 'mongoose';

// The movie schema used by mongoose.
const MovieSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  imdb_id: String,
  title: String,
  slug: String,
  year: String,
  synopsis: String,
  runtime: Number,
  genres: [String],
  country: String,
  released: Number,
  trailer: String,
  certification: String,
  images: {
    poster: String,
    background: String
  },
  rating: {
    percentage: Number,
    watching: Number,
    votes: Number
  },
  torrents: {}
});

MovieSchema.index({ title: 'text', _id: 1 });

export const Movie = mongoose.model('Movie', MovieSchema);
