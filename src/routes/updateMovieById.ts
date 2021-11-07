// external
import { StatusCodes } from 'http-status-codes';

// types & interfaces
import { FastifyReply, RequestGenericInterface } from 'fastify';
import { IStorage } from '../storage';


interface requestGeneric extends RequestGenericInterface {
    params: {
        id: string
    },
    body: {
        comment: string,
        personalScore: number
    }
}


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
            handler: async function ( request: requestGeneric, response: FastifyReply ) {
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

                return {
                    error: `Movie with ID ${request.params.id} is not found in database.`
                };
            }
        };
    }
};
