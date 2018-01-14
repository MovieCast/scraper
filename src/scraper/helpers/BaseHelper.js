import Logger from "../../util/Logger";

export default class BaseHelper {
    constructor() {
        this.logger = new Logger(this.constructor.name);
    }

    async getImages({imdbID, tmdbID}) {
        throw new Error('Using default method: \'getImages\'');
    }

    async getMetadata(slug) {
        throw new Error('Using default method: \'getMetadata\'');
    }
}