// types & interfaces
import { RequestGenericInterface } from 'fastify';
import { JwtPayload } from 'jsonwebtoken';
import { IStorage } from '../storage';
import '../types';

// schemas
import getAllMoviesSchema from './schemas/getAllMoviesSchema';

// middlewares
import auth from '../middlewares/auth';
import hasAccess from '../middlewares/hasAccess';


export default {
    init: (storage: IStorage) => {
        return {
            schema: getAllMoviesSchema,
            preHandler: [auth, hasAccess],
            handler: async function ( request: RequestGenericInterface ) {
                const { fields, limit, offset } = request.query;
                const { payload: { email } } = request.user as JwtPayload;
                let storageResponse = await storage.getUserFavorites(email, fields);

                offset >= 0 && (storageResponse = storageResponse.slice(offset));
                limit > 0 && (storageResponse = storageResponse.slice(0, limit));

                return {data: storageResponse};
            }
        };
    }
};
