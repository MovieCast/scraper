import mongoose from 'mongoose';

import MovieModel from './MovieModel';
import movieSchema from './movieSchema';

movieSchema.index({
  title: 'text',
  synopsis: 'text',
  _id: 1
});

movieSchema.loadClass(MovieModel);

export default mongoose.model(MovieModel, movieSchema);
