import pkg from '../../package.json';

module.exports = [{
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        return reply({
            server: pkg.name,
            version: pkg.version,
            uptime: process.uptime() | 0,
        });
    }
}]