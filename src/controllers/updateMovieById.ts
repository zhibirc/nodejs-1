// external
import { StatusCodes } from 'http-status-codes';

// types & interfaces
import { FastifyReply, RequestGenericInterface } from 'fastify';
import { IStorage } from '../storage';
import '../types';

// middlewares
import auth from '../middlewares/auth';
import hasAccess from '../middlewares/hasAccess';


export default {
    init: (storage: IStorage) => {
        return {
            schema: {
                params: {
                    id: {
                        type: 'string',
                        pattern: '^[a-z]{1,2}\\d{1,10}$'
                    }
                },
                body: {
                    comment: {
                        type: 'string'
                    },
                    personalScore: {
                        type: 'number'
                    }
                }
            },
            preHandler: [auth, hasAccess],
            handler: async function ( request: RequestGenericInterface, response: FastifyReply ) {
                const storageResponse = storage.update(
                    request.params.id,
                    {
                        comment: request.body.comment,
                        personalScore: request.body.personalScore
                    });

                if ( storageResponse ) {
                    response.statusCode = StatusCodes.OK;

                    return {data: storageResponse};
                }

                response.statusCode = StatusCodes.NOT_FOUND;

                return {error: `Movie with ID ${request.params.id} is not found in database.`};
            }
        };
    }
};
