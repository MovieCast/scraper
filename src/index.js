
import * as mongodb from './mongodb';
import * as Server from './server';
import { Scraper } from './scraper';
import { Console } from './util/Logger';

mongodb.connect().then(async () => {
  await Server.start();
  await Scraper.start(true);
});

process.on('unhandledRejection', (err) => {
  Console.error(err);
  Console.log(err);
});
