
import * as mongodb from './mongodb';
import * as server from './server';
import * as scraper from './scraper';
import Logger from './util/Logger';

const logger = new Logger('Main');

mongodb.connect().then(async () => {
    await server.start();
    await scraper.start();
});

process.on('unhandledRejection', err => {
    logger.error(err);
    console.log(err);
})