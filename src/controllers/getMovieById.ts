// external
import { StatusCodes } from 'http-status-codes';

// types & interfaces
import { FastifyReply, RequestGenericInterface } from 'fastify';
import { IStorage } from '../storage';
import '../types';


export default {
    init: (storage: IStorage) => {
        return {
            schema: {
                params: {
                    id: {
                        type: 'string',
                        pattern: '^[a-z]{1,2}\\d{1,10}$'
                    }
                }
            },
            handler: async function ( request: RequestGenericInterface, response: FastifyReply ) {
                const storageResponse = storage.read(request.params.id);

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
