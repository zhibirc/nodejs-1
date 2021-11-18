import { FastifyReply, FastifyRequest} from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { IStorage } from '../storage';
import '../types';

// middlewares
import auth from '../middlewares/auth';
import hasAccess from '../middlewares/hasAccess';


export default {
    init: (storage: IStorage) => {
        return {
            schema: {
                body: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                        id: {
                            type: 'string'
                        },
                        favorites: {
                            type: 'boolean'
                        }
                    }
                }
            },
            preHandler: [auth, hasAccess],
            handler: async function ( request: FastifyRequest, response: FastifyReply ) {
                // @ts-ignore
                let { id: movieId, favorites: isFavorite } = request.body;
                const isExistInStorage: boolean = storage.isExist(movieId);

                if ( !isExistInStorage ) {
                    return response
                        .code(StatusCodes.NOT_FOUND)
                        .send({error: 'Movie not found.'});
                }

                const { payload: { email } } = request.user as JwtPayload;
                const user = storage.findUser(email)!;

                isFavorite
                    ? user.movieFavoritesList.add(movieId)
                    : user.movieFavoritesList.delete(movieId);

                storage.updateUser(user);

                return {data: `Favorites state is set to ${isFavorite} for movie ${movieId}.`};
            }
        };
    }
};
