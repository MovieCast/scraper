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
      MONGO_HOST = 'localhost',
      MONGO_PORT = 27017,
      MONGO_AUTH = 'admin',
      MONGO_DATABASE = 'moviecast-api',
      MONGO_USER = null,
      MONGO_PASS = null
    } = process.env;

    tries++;
    const uri = `mongodb://${MONGO_HOST}:${MONGO_PORT}`;

    // Connect to mongo db using mongoose
    await mongoose.connect(uri, {
      authdb: MONGO_AUTH, dbName: MONGO_DATABASE, user: MONGO_USER, pass: MONGO_PASS
    });

    // return mongoose.connection.once('open', async () => {
    logger.info(`Connected to ${uri}`);
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
