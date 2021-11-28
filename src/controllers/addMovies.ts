import { FastifyReply, FastifyRequest} from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { IStorage } from '../storage';
import searchOmdb from '../services/searchOmdb';
import '../types';
import { JwtPayload } from 'jsonwebtoken';
import { MetaInfo } from '../storage';

// middlewares
import auth from '../middlewares/auth';
import hasAccess from '../middlewares/hasAccess';

// schemas
import addMoviesSchema from './schemas/addMoviesSchema';


export default {
    init: (storage: IStorage) => {
        return {
            schema: addMoviesSchema,
            preHandler: [auth, hasAccess],
            handler: async function ( request: FastifyRequest, response: FastifyReply ) {
                try {
                    // @ts-ignore
                    const { name, comment, personalScore } = request.body;
                    const { payload: { email } } = request.user as JwtPayload;

                    const data = await searchOmdb(name);
                    const movieId = await storage.addMovie(data, email);

                    const meta: MetaInfo = {};

                    comment && (meta.comment = comment.trim());
                    personalScore && (meta.personalScore = personalScore);

                    if ( Object.keys(meta).length ) {
                        await storage.setMovieMetaInfo(meta, email, movieId);
                    }

                    return {data};
                } catch {
                    return response
                        .code(StatusCodes.INTERNAL_SERVER_ERROR)
                        .send({error: 'Unexpected error.'});
                }
            }
        };
    }
};
