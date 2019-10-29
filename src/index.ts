import { Scraper } from "./Scraper";
import { CancellationTokenSource } from "./CancellationToken";
import { YtsProvider } from "./providers/YtsProvider";

const source = new CancellationTokenSource();
const scraper = new Scraper();

scraper.use(new YtsProvider(), {
    query: {
        limit: 2
    }
});

scraper.scrape(source.token).catch(e => console.error(e));