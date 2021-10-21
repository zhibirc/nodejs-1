const http = require('http');

const { APP_PORT, ENV } = require('./config');
const { log } = require('./logger');

http
    .createServer((request, response) => {
        response.end('Hello, world!');
    })
    .listen(APP_PORT, () => {
        log(`Server is listening on port ${APP_PORT}.\nEnv is ${ENV}.`);
    });
