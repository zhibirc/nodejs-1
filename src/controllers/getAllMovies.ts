// types & interfaces
import { RequestGenericInterface } from 'fastify';
import { IStorage } from '../storage';
import '../types';

// schemas
import * as getMovieListSchema from './schemas/getMovieList';


export default {
    init: (storage: IStorage) => {
        return {
            schema: getMovieListSchema,
            handler: async function ( request: RequestGenericInterface ) {
                const { fields, limit, offset } = request.query;
                let storageResponse: any = storage.read(null, fields);

                offset >= 0 && (storageResponse = storageResponse.slice(offset));
                limit > 0 && (storageResponse = storageResponse.slice(0, limit));

                return {data: storageResponse};
            }
        };
    }
};
