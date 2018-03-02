import { IProvider } from '../interfaces';
import Logger from '../util/Logger';

export default class ScraperContext {
  /**
   * Logger intance for the ScraperContext
   * @type {Logger}
   */
  logger = new Logger('ScraperContext');

  /**
   * The provider to scrape from
   * @type {IProvider}
   * @private
   */
  provider = new IProvider();

  /**
   * Set the current provider to use for scraping
   * @param {IProvider} provider - the provider to scrape from
   */
  setProvider(provider) {
    this.logger.debug(`Provider set to ${provider.constructor.name}`);
    this.provider = provider;

    return this;
  }

  /**
   * Get the current provider
   * @return {IProvider} - the current provider
   */
  getProvider() {
    return this.provider;
  }

  /**
   * Start scrape process on set provider
   */
  async execute() {
    this.logger.debug(`Executing provider ${this.provider.constructor.name}`);
    return this.provider.fetch();
  }
}
