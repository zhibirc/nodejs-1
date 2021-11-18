import { FastifyRequest, FastifyReply, DoneFuncWithErrOrRes } from 'fastify';
import { StatusCodes } from 'http-status-codes';


interface RequestGeneric extends FastifyRequest {
    user: {[key: string]: any} | null
}


export default function ( request: RequestGeneric, response: FastifyReply, done: DoneFuncWithErrOrRes ) {
    if ( !request.user ) {
        return response
            .code(StatusCodes.UNAUTHORIZED)
            .send({error: 'Unauthorized access is prohibited.'});
    }

    done();
}
