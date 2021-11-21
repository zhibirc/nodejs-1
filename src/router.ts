/**
 * Routes declaration for server API.
 */

// types & interfaces
import { FastifyInstance, RouteOptions } from 'fastify';
import { IStorage } from './storage';

// controllers
import addMovies from './controllers/addMovies';
import getStatic from './controllers/getStatic';
import getAllMovies from './controllers/getAllMovies';
import getMovieById from './controllers/getMovieById';
import updateMovieById from './controllers/updateMovieById';
import deleteMovieById from './controllers/deleteMovieById';
import register from './controllers/register';
import login from './controllers/login';
import setFavorites from './controllers/setFavorites';
import getFavorites from './controllers/getFavorites';


type Router = {
    [key: string]: { [key: string]: RouteOptions | any; };
};

const router: Router = {
    GET: {
        /**
         * Serve static HTML page for the site root.
         *
         * @public
         */
        '/': getStatic,

        /**
         * Get all movies.
         * Return list of all user's movies from the service storage.
         * It supports sorting by different fields as well as pagination.
         *
         * @public
         */
        '/movies': getAllMovies,

        /**
         * Get movie by ID.
         * Return all information about movies associated with ID.
         *
         * @public
         */
        '/movies/:id': getMovieById,

        /**
         * Get Favorites movie list for particular user.
         *
         * @private
         */
        '/favorites': getFavorites
    },

    /**
     * Add new movie.
     *
     * Add a new movie to the service's storage.
     * Search for a movie by name in the OMDb database and if the movie exists - add this information to the storage.
     * Otherwise, store data provided in the request by the user.
     */
    POST: {
        /**
         * Sign up for a new user.
         * Email and password of required constraints should be provided.
         *
         * @public
         */
        '/register': register,

        /**
         * Sign in to the application with given credentials.
         *
         * @public
         */
        '/login': login,

        /**
         * Add movies to collection.
         * Search in OMDb movie database and add result into local collection.
         *
         * @private
         */
        '/movies': addMovies,

        /**
         * Include/exclude a movie to/from Favorites list for particular user.
         *
         * @private
         */
        '/favorites': setFavorites
    },

    PATCH: {
        /**
         * Update movie by ID.
         * Update user's information about the particular movie.
         *
         * @private
         */
        '/movies/:id': updateMovieById
    },

    DELETE: {
        /**
         * Delete movie by ID.
         * Delete movies from the service's storage.
         *
         * @private
         */
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

    // @ts-ignore
    serverInstance.get('/healthcheck', () => 'OK');
};
