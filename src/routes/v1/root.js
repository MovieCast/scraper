import { Router } from 'express';

import RootController from '../../controllers/v1/RootController';

export default () => {
    const routes = Router();

    routes.get('/', RootController.index);

    return routes;
}