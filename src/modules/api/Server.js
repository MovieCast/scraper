import bodyParser from "body-parser";
import Express from 'express';
import http from 'http';
import { Router } from './Router';

export class Server {
    constructor() {
        this.app = new Express();
        this.router = new Router(this.app);
        this.server = http.createServer(this.app);

        // Setup express
        this._setup();
    }

    _setup() {
        // Enable url encoded and json bodies.
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        // Load all routes
        this.router.loadRoutes();
    }

    serve(port) {
        // TODO: Create a nice config file
        this.server.listen(port);
    }
}