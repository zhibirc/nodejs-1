// external
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

// types & interfaces
import { RequestGenericInterface } from 'fastify';
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
            handler: async function ( request: requestGeneric ) {
                const storageResponse = storage.update(
                    request.params.id,
                    {
                        comment: request.body.comment,
                        personalScore: request.body.personalScore
                    });

                return storageResponse
                    ? {data: storageResponse}
                    : {error: `${StatusCodes.NO_CONTENT} ${getReasonPhrase(StatusCodes.NO_CONTENT)}`};
            }
        };
    }
};
