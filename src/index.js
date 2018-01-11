
import * as mongodb from './mongodb';
import * as server from './server';
import * as scraper from './scraper';

mongodb.connect().then(async () => {
    await server.start();
    await scraper.start();
});
