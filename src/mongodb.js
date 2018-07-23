import mongoose from 'mongoose';
import { URL } from 'url';
import { isMaster } from 'cluster';

import Logger from './util/Logger';

const logger = new Logger('MongoDB');

let tries = 0;
const maxTries = 5;

export async function connect() {
  try {
    const {
      MONGO_HOST,
      MONGO_PORT,
      MONGO_DATABASE,
      MONGO_USER,
      MONGO_PASS
    } = process.env;

    tries++;
    const uri = new URL(`mongodb://${MONGO_USER || ''}:${MONGO_PASS || ''}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`);

    // Connect to mongo db using mongoose
    await mongoose.connect(uri.href);

    // return mongoose.connection.once('open', async () => {
    logger.info(`Connected to ${uri.href}`);
    // });
  } catch (e) {
    logger.error('An error occured while connecting to mongodb', e);

    if (tries <= maxTries) {
      logger.debug(`Retrying to reconnect in ${tries * 600}ms, attempt ${tries} of ${maxTries}`);
      return setTimeout(() => connect(), tries * 600);
    }

    if (!isMaster) {
      logger.error('Failed to connect to mongo, process will exit');
      process.exit(1);
    }
  }
}

export async function disconnect() {
  mongoose.disconnect();
}
