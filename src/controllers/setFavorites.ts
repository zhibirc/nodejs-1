import { FastifyReply, FastifyRequest} from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { IStorage } from '../storage';
import auth from '../middlewares/auth';
import '../types';


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
            preHandler: auth,
            handler: async function ( request: FastifyRequest, response: FastifyReply ) {
                if ( !request.user ) {
                    return response
                        .code(StatusCodes.FORBIDDEN)
                        .send({error: 'Unauthorized access is prohibited.'});
                }

                // @ts-ignore
                let { id: movieId, favorites: isFavorite } = request.body;
                const isExistInStorage: boolean = storage.isExist(movieId);

                if ( !isExistInStorage ) {
                    response.statusCode = StatusCodes.NOT_FOUND;

                    return {error: 'Movie not found'};
                }

                const { payload: { email } } = request.user;
                const user = storage.findUser(email)!;

                if ( isFavorite && !user.movieFavoritesList.includes(movieId) ) {
                    user.movieFavoritesList.push(movieId);
                }

                if ( !isFavorite && user.movieFavoritesList.includes(movieId) ) {
                    user.movieFavoritesList.splice(user.movieFavoritesList.indexOf(movieId), 1);
                }

                storage.updateUser(user);
                response.statusCode = StatusCodes.OK;

                return {data: `Favorites state is set to ${isFavorite} for movie ${movieId}`};
            }
        };
    }
};
