import * as expect from 'expect.js';
import { Storage } from '../src/storage';
import Fastify, { FastifyInstance } from 'fastify';

// TODO: add new test
describe('Main components', () => {
    const server: FastifyInstance = Fastify({
        logger: process.env.NODE_ENV !== 'production'
    });
    // Pino instance
    const logger = server.log;
    const storage = new Storage(logger);

    it('Storage class', () => {
        expect(storage).to.be.a(Storage);
        expect(storage).to.only.have.keys('add', 'read', 'update', 'delete', 'logger');
    });
});
