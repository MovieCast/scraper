import mongoose from 'mongoose';
import { URL } from 'url';

import Logger from './util/Logger';

// mongoose.Promise = Promise;

const logger = new Logger('MongoDB');

export async function connect() {
  const {
    MONGO_HOST,
    MONGO_PORT,
    MONGO_DATABASE,
    MONGO_USER,
    MONGO_PASS
  } = process.env;

  const uri = new URL(`mongodb://${MONGO_USER || ''}:${MONGO_PASS || ''}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`);

  // Connect to mongo db using mongoose
  mongoose.connect(uri.href);

  return mongoose.connection.once('open', async () => {
    logger.info(`Connected to ${uri.href}`);
  });
}
