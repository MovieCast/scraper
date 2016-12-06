import v1ApiRoutes from './v1';

export default (server) => {
    // v1 API routes
    server.use('/v1', v1ApiRoutes());
}