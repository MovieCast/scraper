import file from 'file';
import path from 'path';
import { name, version } from './package.json';

class EndpointPlugin {
    static register(server, options, next) {
        file.walkSync(options.directory, (folder, innerFolders, files) => {
            for (let file of files) {
                // Not a js file, skip.
                if (path.extname(file) !== '.js') continue;
    
                // Check if the file is really a route...
                let route = require(path.join(folder, file));
    
                // Check if we have multiple routes in one file, yus this is possible.
                if(route instanceof Array) {
                    for(let r of route) {
                        EndpointPlugin.addRoute(server, folder, r);
                    }
                } else {
                    EndpointPlugin.addRoute(server, folder, route);
                }
            }
        });
        next();
    }

    static addRoute(server, folder, route) {
        if(!route.path) return;
    
        let prefix = folder.split(path.sep).pop();
        if(prefix !== 'routes')
            route.path = `/${prefix}${route.path}`;
    
        server.route(route);
    }
}

EndpointPlugin.register.attributes = {
    name,
    version
};

export default EndpointPlugin;
