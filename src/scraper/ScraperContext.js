import { IProvider } from '../interfaces/IProvider';

export default class ScraperContext {

    /**
     * The provider to scrape from
     * @type {IProvider}
     */
    _provider = new IProvider();

    /**
     * Set the current provider to use for scraping
     * @param {IProvider} provider - the provider to scrape from
     */
    setProvider(provider) {
        this._provider = provider;
    }

    /**
     * Get the current provider
     * @return {IProvider} - the current provider
     */
    getProvider() {
        return this._provider;
    }

    /**
     * Start scrape process on set provider
     */
    execute() {
        return this._provider.fetch();
    }
}