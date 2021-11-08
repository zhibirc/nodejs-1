import { FastifyReply, FastifyRequest} from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { IStorage } from '../storage';
import { default as searchOmdb } from '../services/omdb-search';

export default {
    init: (storage: IStorage) => {
        return {
            schema: {
                body: {
                    // name of the movie, overwrites original film title if given
                    name: {
                        type: 'string'
                    },
                    // user's comment
                    comment: {
                        type: 'string'
                    },
                    // user's movie score
                    personalScore: {
                        type: 'number'
                    }
                }
            },
            handler: async function ( request: FastifyRequest, response: FastifyReply ) {
                try {
                    // @ts-ignore
                    const { name, comment, personalScore } = request.body;
                    const info = await searchOmdb(name);

                    comment && (info.comment = comment);
                    personalScore && (info.personalScore = personalScore);

                    const storageResponse = storage.add(info);

                    response.statusCode = StatusCodes.OK;

                    return {data: storageResponse};
                } catch ( exception ) {
                    response.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

                    return {
                        error: 'Unexpected error.'
                    };
                }
            }
        };
    }
};
