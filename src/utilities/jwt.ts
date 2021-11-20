// external
import {sign, verify, Secret, JwtPayload} from 'jsonwebtoken';

// configuration
import config from '../config';


export default {
    sign: (payload: JwtPayload): Secret => sign(payload, config.JWT_SECRET as Secret, { expiresIn: config.JWT_TTL_SEC }),
    verify: (token: string): JwtPayload | string | boolean => {
        try {
            return verify(token, config.JWT_SECRET);
        } catch {
            return false;
        }
    }
}
