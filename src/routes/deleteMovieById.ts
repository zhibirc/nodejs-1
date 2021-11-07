// external
import { StatusCodes } from 'http-status-codes';

// types & interfaces
import { FastifyReply, RequestGenericInterface } from 'fastify';
import { IStorage } from '../storage';


interface requestGeneric extends RequestGenericInterface {
    params: {
        id: string
    }
}


export default {
    init: (httpClient: any, storage: IStorage) => {
        if ( !httpClient || !storage ) {
            throw new Error('Router dependencies are incorrect.');
        }

        return {
            schema: {
                params: {
                    id: {
                        type: 'string',
                        pattern: '^[a-z]{1,2}\\d{1,10}$'
                    }
                }
            },
            handler: async function ( request: requestGeneric, response: FastifyReply ) {
                const storageResponse = storage.delete(request.params.id);

                if ( storageResponse ) {
                    response.statusCode = StatusCodes.OK;

                    return {error: null};
                }

                response.statusCode = StatusCodes.NOT_FOUND;

                return {error: 'Movie with this ID is not found in database.'};
            }
        };
    }
};
