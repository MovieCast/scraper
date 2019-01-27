import 'dotenv/config';

import * as mongodb from './mongodb';
import Scraper from './Scraper';
import { Console } from './util/Logger';

mongodb.connect().then(async () => {
  await Scraper.start(true);
});

process.on('unhandledRejection', (err) => {
  Console.error(err);
  Console.log(err);
});
