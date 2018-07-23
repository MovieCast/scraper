import 'dotenv/config';

import cluster from 'cluster';
import * as mongodb from './mongodb';
import Scraper from './Scraper';
import { Console } from './util/Logger';

mongodb.connect().then(async () => {
  if (cluster.isMaster) {
    for (let i = 0; i < process.env.API_WORKERS; i++) {
      cluster.fork();
    }
    cluster.on('exit', ({ process }) => {
      Console.error(`Worker '${process.pid}' died, spinning up another!`);
      cluster.fork();
    });

    await Scraper.start(true);
  }
});

process.on('unhandledRejection', (err) => {
  Console.error(err);
  Console.log(err);
});
