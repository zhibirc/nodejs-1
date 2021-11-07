/**
 * Return movies for particular user.
 */

// types & interfaces
import { RequestGenericInterface } from 'fastify';
import { IStorage } from '../storage';


interface requestGeneric extends RequestGenericInterface {
    query: {
        fields: string,
        limit: number,
        offset: number
    }
}


export default {
    init: (httpClient: any, storage: IStorage) => {
        if ( !httpClient || !storage ) {
            throw new Error('Router dependencies are incorrect.');
        }

        return {
            schema: {
                querystring: {
                    // There are multiple choices for specifying enumeration as query parameter's value:
                    // ?id=[1,2] | ?id=1&id=2 | ?id=1,2
                    // The last one was chosen.
                    fields: {
                        type: 'string'
                    },
                    // for pagination
                    limit: {
                        type: 'number',
                        pattern: '^[1-9]\\d*$'
                    },
                    offset: {
                        type: 'number',
                        pattern: '^\\d+$'
                    }
                }
            },
            handler: async function ( request: requestGeneric ) {
                const { fields, limit, offset } = request.query;
                let storageResponse: any = storage.read();

                if ( fields ) {
                    let requestedKeys = fields
                        .split(',')
                        .map(field => field.trim())
                        .filter(Boolean);

                    if ( requestedKeys.length ) {
                        storageResponse = storageResponse
                            .map((item: any) => {
                                for ( const key in item ) {
                                    if ( !requestedKeys.includes(key) ) {
                                        delete item[key];
                                    }
                                }

                                return item;
                            })
                            .filter((item: any) => Object.keys(item).length);
                    }
                }

                offset >= 0 && (storageResponse = storageResponse.slice(offset));
                limit > 0 && (storageResponse = storageResponse.slice(0, limit));

                return {data: storageResponse};
            }
        };
    }
};
