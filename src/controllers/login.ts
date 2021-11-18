import { FastifyReply, FastifyRequest} from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { IStorage } from '../storage';
import { Hasher } from '../utilities/hasher';
import jwt from '../utilities/jwt';


const hasher = new Hasher();


export default {
    init: (storage: IStorage) => {
        return {
            schema: {
                body: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email'
                        },
                        password: {
                            type: 'string'
                        }
                    }
                }
            },
            handler: async function ( request: FastifyRequest, response: FastifyReply ) {
                // @ts-ignore
                const { email, password } = request.body;
                const user = storage.findUser(email);

                if ( user ) {
                    const role = user.role;

                    if ( hasher.verify(password, user.password) ) {
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