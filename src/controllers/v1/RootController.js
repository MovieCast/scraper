import BaseController from '../BaseController';

import { version, description } from '../../../package.json';

class RootController extends BaseController {

    /**
     * This returns the current version of the api as defined in the package.json as well as authentication information.
     *
     * @param {Object} req
     * @param {Object} res
     * @returns {Object}
     */
    static index(req, res) {
        return res.json({
            version,
            description
        });
    }
}

export default RootController;