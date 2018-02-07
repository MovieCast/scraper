/**
 * Interface for a scraper provider.
 * @interface
 */
export class IProvider {
  /**
     * Default method to get content.
     * @abstract
     * @throws {Error} - Using default method: 'getContent'.
     */
  getContent() {
    throw new Error('Using default method: \'getContent\'');
  }

  /**
     * Default method to get all data from api.
     * @abstract
     * @throws {Error} - Using default method: 'getAllTorrents'.
     */
  getAllData() {
    throw new Error('Using default method: \'getAllData\'');
  }

  /**
     * Default method to fetch torrents.
     * @abstract
     * @throws {Error} - Using default method: 'fetch'.
     */
  fetch() {
    throw new Error('Using default method: \'fetch\'');
  }
}
