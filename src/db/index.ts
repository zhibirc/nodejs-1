import { Pool } from 'pg';
import { FastifyLoggerInstance } from 'fastify';
import errorCodes from './errorCodes';


export interface IDatabase {
    query: (sqlText: string, params: unknown[]) => Promise<any>
}

export class Database implements IDatabase {
    private pool: Pool;
    private logger: FastifyLoggerInstance;

    constructor ( config, logger ) {
        this.pool = new Pool(config);
        this.logger = logger;
    }

    async query ( sqlText, params ) {
        try {
            const start = Date.now();
            const result = await this.pool.query(sqlText, params);

            this.logger.info(`Request "${sqlText}" completed in ${Date.now() - start}ms.`);

            return result;
        } catch ( exception ) {
            const error = errorCodes[exception.code];

            error && this.logger.error(`General error: ${error}.`);
            this.logger.error(exception);

            throw exception;
        }
    }
}
