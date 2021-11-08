const expect = require('expect.js');
const Storage = require('../src/storage');
const Fastify = require('fastify');

// TODO: add new test
describe('Main components', () => {
    const server = Fastify({
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
