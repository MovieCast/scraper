import mongoose from 'mongoose';
import config from 'config';
import Hapi from 'hapi';
import path from 'path';

const server = new Hapi.Server();
server.connection({
    host: config.server.host,
    port: config.server.port,
    router: {
        stripTrailingSlash: true
    },
    routes: {
        cors: true
    },
    state: {
        strictHeader: false
    }
});

server.register([
    {
        register: require('good'),
        options: {
            ops: {
                interval: 30000
            },
            reporters: {
                myConsoleReporter: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{ log: '*', error: '*', response: '*', request: '*', ops: '*' }]
                }, {
                    module: 'good-console',
                    args: [{
                        format: 'YYYY-MM-DD HH:mm:ss'
                    }]
                }, 'stdout']
            }
        }
    },
    {
        // Register our endpoints with our EndpointPlugin
        register: require('./modules/hapi-endpoint').default,
        options: {
            directory: path.join(__dirname, './routes')
        }
    }
], err => {
    // Something didn't go so well...
    if (err) return console.error(err);

    // Build the connection uri
    let uri = 'mongodb://'
    if (config.database.username && config.database.password) {
    uri += `${config.database.username}:${config.database.password}@`
    }
    uri += `${config.database.host}:${config.database.port}/${config.database.name}`

    // Connect to mongo db using mongoose
    mongoose.Promise = global.Promise
    mongoose.connect(uri, {
        useMongoClient: true
    });

    mongoose.connection.once('open', () => {
        server.log(['mongo'], `Connected to ${uri}`);
    });
    
    // Start the hapi server
    server.start(err => {
        // We fked up.
        if (err) return console.error(err);

        server.log(['server'], `Server running at: ${server.info.uri}`);
    });
});