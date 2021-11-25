import { FastifyReply, FastifyRequest} from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { IStorage } from '../storage';
import '../types';

// middlewares
import auth from '../middlewares/auth';
import hasAccess from '../middlewares/hasAccess';

// schemas
import setFavoritesSchema from './schemas/setFavoritesSchema';


export default {
    init: (storage: IStorage) => {
        return {
            schema: setFavoritesSchema,
            preHandler: [auth, hasAccess],
            handler: async function ( request: FastifyRequest, response: FastifyReply ) {
                // @ts-ignore
                let { id: movieId, favorites: isFavorite } = request.body;
                const isExistInStorage: boolean = await storage.isMovieExist(movieId);

                if ( !isExistInStorage ) {
                    return response
                        .code(StatusCodes.NOT_FOUND)
                        .send({error: 'Movie not found.'});
                }

                const { payload: { email } } = request.user as JwtPayload;

                await storage.setUserFavorites(email, movieId, isFavorite);

                return {data: `Favorites state is set to ${isFavorite} for movie ${movieId}.`};
            }
        };
    }
};
