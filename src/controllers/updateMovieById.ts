// external
import { StatusCodes } from 'http-status-codes';

// types & interfaces
import { FastifyReply, RequestGenericInterface } from 'fastify';
import { IStorage } from '../storage';
import { JwtPayload } from 'jsonwebtoken';
import '../types';

// middlewares
import auth from '../middlewares/auth';
import hasAccess from '../middlewares/hasAccess';

// schemas
import updateMovieByIdSchema from './schemas/updateMovieByIdSchema';


export default {
    init: (storage: IStorage) => {
        return {
            schema: updateMovieByIdSchema,
            preHandler: [auth, hasAccess],
            handler: async function ( request: RequestGenericInterface, response: FastifyReply ) {
                const { payload: { email } } = request.user as JwtPayload;
                const storageResponse = await storage.updateMovieMetaInfo(
                    request.params.id,
                    {
                        comment: request.body.comment,
                        personalScore: request.body.personalScore
                    }, email);

                if ( storageResponse ) {
                    return {message: `Information added for movie with ID ${request.params.id}.`};
                }

                return response
                    .code(StatusCodes.NOT_FOUND)
                    .send({error: `Movie with ID ${request.params.id} is not found in database.`});
            }
        };
    }
};
