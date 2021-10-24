const http = require('http');

const { APP_PORT, ENV } = require('./config');
const { log } = require('./logger');

const server = http
    .createServer((request, response) => {
        response.end('Hello, world!');
    })
    .listen(APP_PORT, () => {
        log(`Server is listening on port ${APP_PORT}.\nEnv is ${ENV}.`);
    });

server.on('clientError', (error, socket) => {
    // for more details error.rawPacket can be logged
    log(`Request error: "${error.reason}".`);

    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

process.on('uncaughtException', error => {
    log(`Unexpected error: ${error.message}.`);
});
