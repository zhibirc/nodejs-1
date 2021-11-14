import jwt from '../utilities/jwt';
import { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from 'fastify';
import { JwtPayload } from 'jsonwebtoken';


interface requestGeneric extends FastifyRequest {
    user: {[key: string]: any} | null
}


export default function ( request: requestGeneric, response: FastifyReply, done: DoneFuncWithErrOrRes ) {
    const authHeader = request.headers.authorization;

    if ( authHeader && authHeader.split(' ')[0] === 'Bearer') {
        const accessToken = authHeader.split(' ')[1];
        const decoded = jwt.verify(accessToken);

        if ( decoded ) {
            request.user = decoded as JwtPayload;

            return done();
        }
    }

    request.user = null;
    done();
}
