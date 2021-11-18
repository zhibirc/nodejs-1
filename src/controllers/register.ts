import { FastifyReply, FastifyRequest} from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { IStorage } from '../storage';
import { Hasher } from '../utilities/hasher';
import { ROLE_USER } from '../constants/userRoles';


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
                            type: 'string',
                            // Must contain at least one: Latin lowercase letter, Latin uppercase letter, decimal digit, special characterю
                            pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-~`!@#$%^&*()_+={}|<>[\\]\'"])[-A-Za-z\\d~`!@#$%^&*()_+={}|<>[\\]\'"]+$',
                            minLength: 20,
                            maxLength: 32
                        }
                    }
                }
            },
            handler: async function ( request: FastifyRequest, response: FastifyReply ) {
                try {
                    // @ts-ignore
                    const { email, password } = request.body;
                    const user = storage.findUser(email);

                    if ( user ) {
                        response.statusCode = StatusCodes.FORBIDDEN;

                        return {error: `User with ${email} already exists.`};
                    }

                    const hasher = new Hasher();

                    storage.addUser({
                        email,
                        password: hasher.hash(password),
                        role: ROLE_USER,
                        movieFavoritesList: new Set()
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
