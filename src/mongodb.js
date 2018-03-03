import config from 'config';
import mongoose from 'mongoose';

import Logger from './util/Logger';

mongoose.Promise = Promise;

const logger = new Logger('MongoDB');

async function buildURI() {
  let uri = 'mongodb://';
  if (config.database.username && config.database.password) {
    uri += `${config.database.username}:${config.database.password}@`;
  }
  uri += `${config.database.host}:${config.database.port}/${config.database.name}`;

  return uri;
}

export async function connect() {
  const uri = await buildURI();

  // Connect to mongo db using mongoose
  mongoose.connect(uri);

  return mongoose.connection.once('open', async () => {
    // server.log(['mongo'], `Connected to ${uri}`);
    logger.info(`Connected to ${uri}`);
  });
}
