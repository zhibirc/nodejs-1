// external
import { StatusCodes } from 'http-status-codes';

// types & interfaces
import { FastifyReply, RequestGenericInterface } from 'fastify';
import { IStorage } from '../storage';
import '../types';

// middlewares
import auth from '../middlewares/auth';
import hasAccess from '../middlewares/hasAccess';

// schemas
import deleteMovieByIdSchema from './schemas/deleteMovieByIdSchema';


export default {
    init: (storage: IStorage) => {
        return {
            schema: deleteMovieByIdSchema,
            preHandler: [auth, hasAccess],
            handler: async function ( request: RequestGenericInterface, response: FastifyReply ) {
                const storageResponse = await storage.deleteMovie(request.params.id);

                if ( storageResponse ) {
                    return {message: `Movie with ID ${request.params.id} deleted.`};
                }

                return response
                    .code(StatusCodes.NOT_FOUND)
                    .send({error: `Movie with ID ${request.params.id} is not found in database.`});
            }
        };
    }
};
