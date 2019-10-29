export const contentSchema = {
  _id: {
    type: String,
    required: true
  },
  imdb_id: String,
  title: String,
  year: Number,
  slug: String,
  synopsis: String,
  runtime: Number,
  rating: {
    percentage: {
      type: Number
    },
    watching: {
      type: Number
    },
    votes: {
      type: Number
    }
  },
  images: {
    background: {
      type: String
    },
    poster: {
      type: String
    }
  },
  genres: [String]
};
