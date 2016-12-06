import { Router } from 'express';

import rootRoutes from './root';

export default () => {
    const routes = Router();

    routes.use('/', rootRoutes());

    return routes;
}