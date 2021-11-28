import { FastifyReply, FastifyRequest} from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { IStorage } from '../storage';
import { Hasher } from '../utilities/hasher';

// constants
import { ROLE_USER } from '../constants/userRoles';

// schemas
import registerSchema from './schemas/registerSchema';


export default {
    init: (storage: IStorage) => {
        return {
            schema: registerSchema,
            handler: async function ( request: FastifyRequest, response: FastifyReply ) {
                try {
                    // @ts-ignore
                    const { email, password } = request.body;
                    const user = await storage.findUser(email);

                    if ( user ) {
                        response.statusCode = StatusCodes.FORBIDDEN;

                        return {error: `User with ${email} already exists.`};
                    }

                    await storage.addUser({
                        email,
                        password: new Hasher().hash(password),
                        role: ROLE_USER
                    });

                    response.statusCode = StatusCodes.CREATED;

                    return {
                        error: null,
                        message: `User ${email} is successfully registered.`
                    };
                } catch ( exception ) {
                    response.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

                    return {error: 'Unexpected error.'};
                }
            }
        };
    }
};
