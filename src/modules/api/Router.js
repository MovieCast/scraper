import { StatusController, MovieController } from "./controllers";

export class Router {
    constructor(app) {

        this.app = app;

        // Let's make these static, we might need them later
        Router.controllers = {
            status: new StatusController(),
            movie: new MovieController()
        }
    }

    loadRoutes() {
        this.app.get("/status", Router.controllers.status.getStatus);
        this.app.get("/movies", Router.controllers.movie.getMovies);
    }
}