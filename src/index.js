import cluster from 'cluster';
import * as mongodb from './mongodb';
import * as Server from './server';
import { Scraper } from './scraper';
import { Console } from './util/Logger';

mongodb.connect().then(async () => {
  if (cluster.isWorker) {
    await Server.start();
  }

  if (cluster.isMaster) {
    for (let i = 0; i < 2; i++) {
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
