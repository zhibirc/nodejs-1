import Fastify, { FastifyInstance } from 'fastify';
import { addRoutes } from './router';
import config from './config';
import { Storage } from './storage';
import { Database } from './db';


const server: FastifyInstance = Fastify({
    logger: process.env.NODE_ENV !== 'production'
});
// Pino instance
const logger = server.log;
const storage = new Storage(
    new Database({
        user: 'admin',
        host: 'db',
        database: 'movies',
        password: '12345',
        port: 5432
    }, logger),
    logger
);

// initialize routes
addRoutes(server)(storage);
server.decorateRequest('user', null);

const start = async () => {
    try {
        await server.listen(config.APP_PORT, '0.0.0.0');
    } catch ( exception ) {
        logger.error(exception);
        process.exit(1);
    }
};

start();

process.on('uncaughtException', error => {
    logger.error(`Unexpected error: ${error.message}.`);
});

process.on('unhandledRejection', error => {
    logger.error(`Unhandled rejection: ${error}.`);
});
