import { Movie } from '../../models';

// Since we dont need all the movie metadata, lets leave some stuff out
const project = {
    _id: 1,
    title: 1,
    year: 1,
    images: 1,
    released: 1,
    rating: 1,
};

module.exports = [{
    method: 'GET',
    path: '/movies',
    handler: async (request) => {
        const totalMovies = await Movie.count({}).exec();
        return {
            totalPages: Math.ceil(totalMovies / 50),
            totalResults: totalMovies
        }
    }
}, {
    method: 'GET',
    path: '/movies/{page}',
    handler: async (request) => {
        const page = request.params.page - 1;
        const offset = page * 50;

        if (request.params.page === "all") {
            const movies = await Movie.aggregate([{
                $project: project
            }, {
                $sort: {
                    title: -1
                }
            }]).exec();
            
            return {
                page: 'all',
                results: movies
            };
        }

        let query = {};
        const data = request.query;

        if (!data.order)
            data.order = -1;

        let sort = {
            "rating.votes": parseInt(data.order, 10),
            "rating.percentage": parseInt(data.order, 10)
        };

        if (data.keywords) {
            const words = data.keywords.split(" ");
            let regex = data.keywords.toLowerCase();
            if (words.length > 1) {
                regex = "^";
                for (let w in words) {
                    regex += "(?=.*\\b" + RegExp.escape(words[w].toLowerCase()) + "\\b)";
                }
                regex += ".+";
            }
            query.title = new RegExp(regex, "gi");
        }

        if (data.sort) {
            if (data.sort === "name") sort = {
                "title": (parseInt(data.order, 10) * -1)
            };
            if (data.sort == "rating") sort = {
                "rating.percentage": parseInt(data.order, 10),
                "rating.votes": parseInt(data.order, 10)
            };
            if(data.sort == "trending") sort = {
                "rating.watching": parseInt(data.order, 10)
            };
            if (data.sort === "updated") sort = {
                "released": parseInt(data.order, 10)
            };
            if (data.sort === "year") sort = {
                "year": parseInt(data.order, 10)
            };
        }

        if (data.genre && data.genre != "all") {
            query.genres = data.genre;
        }

        const movies = await Movie.aggregate([{
            $sort: sort
        }, {
            $match: query
        }, {
            $project: project
        }, {
            $skip: offset
        }, {
            $limit: 50
        }]).exec();
        
        return {
            page: page + 1,
            results: movies
        };
    }
}]