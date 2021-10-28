/**
 * Unified application logger.
 *
 * @see {@link https://www.npmjs.com/package/winston}
 */

import {
    createLogger,
    format,
    transports,
    config
} from 'winston';


const {
    combine,
    timestamp,
    printf,
    colorize
} = format;

const fileTransport = new transports.File({
    filename: 'error.log',
    level: 'error'
});
const consoleTransport = new transports.Console({
    level: 'info',
    format: combine(
        colorize({
            all: true
        })
    )
});
const syslogFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label || 'server'}] ${level.toUpperCase()}: ${message}`;
});

// hide console output in production
consoleTransport.silent = process.env.NODE_ENV === 'production';


export const logger = createLogger({
    levels: config.syslog.levels,
    format: combine(
        timestamp(),
        syslogFormat
    ),
    transports: [
        fileTransport,
        consoleTransport
    ]
});
