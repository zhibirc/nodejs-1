import { createServer, IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

import router from './router';
import { logger } from './logger';
import config from './config';


const {
    OK,
    BAD_REQUEST,
    NOT_FOUND
} = StatusCodes;

const server = createServer(async (request: IncomingMessage, response: ServerResponse) => {
    const { method, url, headers } = request;
    let parsedUrl = null;
    let handler = null;

    logger.info(`${method} ${url}`);

    if ( method && url ) {
        parsedUrl = new URL(url, `http://${headers.host}`);
        handler = router[method][parsedUrl.pathname.slice(1)];
    }

    if ( handler ) {
        try {
            const data = await handler(request, parsedUrl!);

            response.statusCode = OK;
            response.end(data);
        } catch ( exception ) {
            logger.error(exception);
            response.statusCode = BAD_REQUEST;
            response.end(getReasonPhrase(BAD_REQUEST));
        }
    } else {
        response.statusCode = NOT_FOUND;
        response.end(getReasonPhrase(NOT_FOUND));
    }
});

server.listen(config.APP_PORT, () => {
    logger.info(`Server is listening on port ${config.APP_PORT}. Env is ${config.ENV}.`);
});

server.on('clientError', (error, socket) => {
    // for more details error.rawPacket can be logged
    logger.error(`Request error: "${error.message}".`);

    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

process.on('uncaughtException', error => {
    logger.error(`Unexpected error: ${error.message}.`);
});

process.on('unhandledRejection', error => {
    logger.error(`Unhandled rejection: ${error}.`);
});
