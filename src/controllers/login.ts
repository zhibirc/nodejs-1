import { FastifyReply, FastifyRequest} from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { IStorage } from '../storage';
import { Hasher } from '../utilities/hasher';
import jwt from '../utilities/jwt';

// schemas
import loginSchema from './schemas/loginSchema';


export default {
    init: (storage: IStorage) => {
        return {
            schema: loginSchema,
            handler: async function ( request: FastifyRequest, response: FastifyReply ) {
                // @ts-ignore
                const { email, password } = request.body;

                const user = await storage.findUser(email);

                if ( user ) {
                    const { password_hash, role } = user;

                    if ( new Hasher().verify(password, password_hash) ) {
                        const payload = {email, role};

                        return {
                            ...payload,
                            token: jwt.sign({payload})
                        };
                    }

                    return response
                        .code(StatusCodes.UNAUTHORIZED)
                        .send({error: 'Password is incorrect.'});
                }

                return response
                    .code(StatusCodes.UNAUTHORIZED)
                    .send({error: 'User not found.'});
            }
        };
    }
};
