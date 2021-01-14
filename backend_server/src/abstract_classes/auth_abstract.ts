import * as jwt from 'jsonwebtoken';
import { Auth } from '../interfaces/types';
import { Request } from 'express';
import { cookiesToObject } from '../modules/cookies-Parser';

export abstract class AuthToken {

    protected checkToken (req: Request): Auth {
        const cookiesObj = cookiesToObject(req.headers.cookie);
        const {access_token, token_key} = cookiesObj;
        const auth: Auth = jwt.verify(access_token, token_key) as Auth;
        return auth;
    }
}
