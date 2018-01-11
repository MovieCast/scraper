import pkg from '../../../package.json';

module.exports = [{
    method: 'GET',
    path: '/',
    handler: (request) => {
        return {
            server: pkg.name,
            version: pkg.version,
            uptime: process.uptime() | 0,
        };
    }
}]