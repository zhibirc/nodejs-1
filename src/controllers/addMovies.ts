import { FastifyReply, FastifyRequest} from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { IStorage } from '../storage';
import { default as searchOmdb } from '../services/omdb-search';
import '../types';

// middlewares
import auth from '../middlewares/auth';
import hasAccess from '../middlewares/hasAccess';


export default {
    init: (storage: IStorage) => {
        return {
            schema: {
                body: {
                    type: 'object',
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
            preHandler: [auth, hasAccess],
            handler: async function ( request: FastifyRequest, response: FastifyReply ) {
                try {
                    // @ts-ignore
                    const { name, comment, personalScore } = request.body;
                    const info = await searchOmdb(name);

                    comment && (info.comment = comment);
                    personalScore && (info.personalScore = personalScore);

                    return {data: storage.add(info)};
                } catch {
                    return response
                        .code(StatusCodes.INTERNAL_SERVER_ERROR)
                        .send({error: 'Unexpected error.'});
                }
            }
        };
    }
};
