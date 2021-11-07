/**
 * Routes declaration for server API.
 */

// types & interfaces
import { FastifyInstance, RouteOptions } from 'fastify';
import { IStorage } from './storage';

// routes
import addMovies from './routes/addMovies';
import getStatic from './routes/getStatic';
import getAllMovies from './routes/getAllMovies';
import getMovieById from './routes/getMovieById';
import updateMovieById from './routes/updateMovieById';
import deleteMovieById from './routes/deleteMovieById';


type Router = {
    [key: string]: { [key: string]: RouteOptions | any; };
};

const router: Router = {
    GET: {
        /**
         * Serve static HTML page for the site root.
         */
        '/': getStatic,

        /**
         * Get all movies.
         *
         * Return list of all user's movies from the service storage.
         * It supports sorting by different fields as well as pagination.
         */
        '/movies': getAllMovies,

        /**
         * Get movie by ID.
         *
         * Return all information about movies associated with ID.
         */
        '/movies/:id': getMovieById
    },

    /**
     * Add new movie.
     *
     * Add a new movie to the service's storage.
     * Search for a movie by name in the OMDb database and if the movie exists - add this information to the storage.
     * Otherwise, store data provided in the request by the user.
     */
    POST: {
        '/movies': addMovies
    },

    /**
     * Update movie by ID.
     *
     * Update user's information about the particular movie.
     */
    PATCH: {
        '/movies/:id': updateMovieById
    },

    /**
     * Delete movie by ID.
     *
     * Delete movies from the service's storage.
     */
    DELETE: {
        '/movies/:id': deleteMovieById
    }
};


export const addRoutes = (serverInstance: FastifyInstance) => (storage: IStorage) => {
    // generate routes
    Object.keys(router).forEach((method: any) => {
        Object.keys(router[method]!).forEach(url => {
            // choose full form in Hapi.js style for more flexibility
            serverInstance.route({
                method,
                url,
                ...router[method][url].init(storage)
            });
        });
    });
};
