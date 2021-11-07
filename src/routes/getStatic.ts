import { readFile } from 'fs';
import { promisify } from 'util';
import { join as joinPath } from 'path';
import { IncomingMessage } from 'http';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { FastifyReply } from 'fastify';
import { IStorage } from '../storage';


const asyncReadFile = promisify(readFile);


export default {
    init: (httpClient: any, storage: IStorage) => {
        if ( !httpClient || !storage ) {
            throw new Error('Router dependencies are incorrect.');
        }

        return {
            // there is fastify-static plugin for it, but we use classic way just for simplicity
            handler: async (request: IncomingMessage, response: FastifyReply) => {
                try {
                    const content = await asyncReadFile(joinPath(__dirname, '..', 'static', 'index.html'));

                    response.code(StatusCodes.OK);
                    response.headers({
                        'Content-Type': 'text/html'
                    });

                    return content;
                } catch ( error: any ) {
                    return error && error.code === 'ENOENT'
                        ? `${StatusCodes.NOT_FOUND} ${getReasonPhrase(StatusCodes.NOT_FOUND)}`
                        : `${StatusCodes.INTERNAL_SERVER_ERROR} ${getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)}`
                }
            }
        };
    }
}
