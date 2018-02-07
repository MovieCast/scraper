import { IProvider } from '../interfaces/IProvider';
import Logger from '../util/Logger';

export default class ScraperContext {
  logger = new Logger('ScraperContext');

  /**
   * The provider to scrape from
   * @type {IProvider}
   * @private
   */
  _provider = new IProvider();

  /**
   * Set the current provider to use for scraping
   * @param {IProvider} provider - the provider to scrape from
   */
  setProvider(provider) {
    this.logger.debug(`Provider set to ${provider.constructor.name}`);
    this._provider = provider;

    return this;
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
  async execute() {
    this.logger.debug(`Executing provider ${this._provider.constructor.name}`);
    return this._provider.fetch();
  }
}
