// external
import { StatusCodes } from 'http-status-codes';

// types & interfaces
import { FastifyReply, RequestGenericInterface } from 'fastify';
import { IStorage } from '../storage';
import '../types';

// schemas
import * as getMovieListSchema from './schemas/getMovieList';

// middlewares
import auth from '../middlewares/auth';


export default {
    init: (storage: IStorage) => {
        return {
            schema: getMovieListSchema,
            preHandler: auth,
            handler: async function ( request: RequestGenericInterface, response: FastifyReply ) {
                if ( !request.user ) {
                    return response
                        .code(StatusCodes.FORBIDDEN)
                        .send({error: 'Unauthorized access is prohibited.'});
                }

                const { fields, limit, offset } = request.query;
                const { payload: { email } } = request.user;
                let storageResponse = storage.getUserFavorites(email, fields);

                offset >= 0 && (storageResponse = storageResponse.slice(offset));
                limit > 0 && (storageResponse = storageResponse.slice(0, limit));

                return {data: storageResponse};
            }
        };
    }
};
