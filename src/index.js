import { getConfig } from './config';
import { Server } from './modules/api';

const config = getConfig();
const apiServer = new Server();

apiServer.serve(process.env.PORT || config.port);