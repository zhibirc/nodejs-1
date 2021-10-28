/**
 * Simple router for using in framework-less server.
 */

import { IncomingMessage} from 'http';
import { randomBytes } from 'crypto';
import { URL } from 'url';


interface Router {
    [key: string]: {[key: string]: (request: IncomingMessage, parsedUrl: URL)=>{}}
}

const router: Router = {
    GET: {
        // it can be static page here, for example
        '': (request, parsedUrl) => 'It works!',
        ipinfo: (request, parsedUrl) => {
            const {socket: {remoteFamily, remoteAddress, remotePort}} = request;

            return `${remoteFamily}::${remoteAddress}:${remotePort}`;
        },
        hello: (request, parsedUrl) => `Hello, ${parsedUrl.searchParams.get('name') || 'dude'}!`,
        bye: (request, parsedUrl) => 'Bye, see you soon!',
        // return random 32-characters string
        secret: (request, parsedUrl) => randomBytes(16).toString('hex')
    },
    POST: {
        data: (request, parsedUrl) => new Promise((resolve, reject) => {
            let data = '';

            request.on('data', (chunk: string) => (data += chunk));
            request.on('end', () => resolve(data.toString()));
            request.on('error', reject);
        })
    }
};


export default router;
