
import * as mongodb from './mongodb';
import * as server from './server';
import * as scraper from './scraper';
import { Console } from './util/Logger';

mongodb.connect().then(async () => {
  await server.start();
  await scraper.start();
});

process.on('unhandledRejection', (err) => {
  Console.error(err);
  Console.log(err);
});
