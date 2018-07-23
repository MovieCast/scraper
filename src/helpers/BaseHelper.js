import Logger from '../../util/Logger';

export default class BaseHelper {
  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  async getImages() {
    throw new Error('Using default method: \'getImages\'');
  }

  async getMetadata() {
    throw new Error('Using default method: \'getMetadata\'');
  }
}
