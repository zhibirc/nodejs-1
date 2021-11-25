// types & interfaces
import { RequestGenericInterface } from 'fastify';
import { IStorage } from '../storage';
import '../types';

// schemas
import getAllMoviesSchema from './schemas/getAllMoviesSchema';


export default {
    init: (storage: IStorage) => {
        return {
            schema: getAllMoviesSchema,
            handler: async function ( request: RequestGenericInterface ) {
                const { fields, limit, offset } = request.query;
                let storageResponse: any = await storage.getMovies(null, fields);

                offset >= 0 && (storageResponse = storageResponse.slice(offset));
                limit > 0 && (storageResponse = storageResponse.slice(0, limit));

                return {data: storageResponse};
            }
        };
    }
};
