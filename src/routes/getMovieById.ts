/**
 * Return movie by its ID for particular user.
 */

// external
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

// types & interfaces
import { RequestGenericInterface } from 'fastify';
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
            handler: async function ( request: requestGeneric ) {
                const storageResponse = storage.read(request.params.id);

                return storageResponse
                    ? {data: storageResponse}
                    : {error: `${StatusCodes.NO_CONTENT} ${getReasonPhrase(StatusCodes.NO_CONTENT)}`};
            }
        };
    }
};
