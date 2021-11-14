import { JwtPayload } from 'jsonwebtoken';


declare module 'fastify' {
    export interface FastifyRequest {
        user: JwtPayload | null
    }

    export interface RequestGenericInterface {
        user: JwtPayload | null,
        params: {
            id: string
        },
        body: {
            comment: string,
            personalScore: number
        },
        query: {
            fields: string,
            limit: number,
            offset: number
        }
    }
}
