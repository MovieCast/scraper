import mongoose from 'mongoose';

import ShowModel from './ShowModel';
import showSchema from './showSchema';

showSchema.index({
  title: 'text',
  synopsis: 'text',
  _id: 1
});

showSchema.loadClass(ShowModel);

export default mongoose.model(ShowModel, showSchema);
