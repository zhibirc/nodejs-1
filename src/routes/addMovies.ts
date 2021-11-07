import config from '../config';
import { FastifyRequest } from 'fastify';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { IStorage } from '../storage';


export default {
    init: (httpClient: any, storage: IStorage) => {
        if ( !httpClient || !storage ) {
            throw new Error('Router dependencies are incorrect.');
        }

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
            handler: async function ( request: FastifyRequest ) {
                try {
                    // @ts-ignore
                    const { name, comment, personalScore } = request.body;

                    let { data: info } = await httpClient.get(`${config.OMDB_API_BASE_URL}&t=${name}`);

                    if ( info.Error ) {
                        info = { name };
                    }

                    comment && (info.comment = comment);
                    personalScore && (info.personalScore = personalScore);

                    const storageResponse = storage.add(info);

                    return storageResponse
                        ? {data: storageResponse}
                        : {error: `${StatusCodes.BAD_REQUEST} ${getReasonPhrase(StatusCodes.BAD_REQUEST)}`};
                } catch ( exception ) {
                    return {
                        error: `${StatusCodes.INTERNAL_SERVER_ERROR} ${getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)}`
                    };
                }
            }
        };
    }
};
