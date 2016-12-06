import express from 'express';
import http from 'http';
import logger from 'morgan';

import { getConfig, environment } from './config';
import routes from './routes';

const config = getConfig();
const server = express();

routes(server);

if (environment === 'development') {
    server.use(logger('dev'));
}

server.listen(process.env.PORT || config.port);