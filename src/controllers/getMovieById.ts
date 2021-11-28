// external
import { StatusCodes } from 'http-status-codes';

// types & interfaces
import { FastifyReply, RequestGenericInterface } from 'fastify';
import { IStorage } from '../storage';
import '../types';

// schemas
import getMovieByIdSchema from './schemas/getMovieByIdSchema';


export default {
    init: (storage: IStorage) => {
        return {
            schema: getMovieByIdSchema,
            handler: async function ( request: RequestGenericInterface, response: FastifyReply ) {
                const storageResponse = await storage.getMovies(request.params.id);

                if ( storageResponse ) {
                    return {data: storageResponse};
                }

                return response
                    .code(StatusCodes.NOT_FOUND)
                    .send({error: `Movie with ID ${request.params.id} is not found in database.`});
            }
        };
    }
};
