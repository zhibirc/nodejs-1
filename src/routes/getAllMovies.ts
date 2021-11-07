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
    init: (storage: IStorage) => {
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
                let storageResponse: any = storage.read(null, fields);

                offset >= 0 && (storageResponse = storageResponse.slice(offset));
                limit > 0 && (storageResponse = storageResponse.slice(0, limit));

                return {data: storageResponse};
            }
        };
    }
};
