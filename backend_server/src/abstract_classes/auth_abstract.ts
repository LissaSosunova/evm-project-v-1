import * as jwt from 'jsonwebtoken';
import { Auth } from '../interfaces/types';
import { Request } from 'express';

export abstract class AuthToken {

    protected checkToken (req: Request): Auth {
        const auth: Auth = jwt.verify(req.headers['authorization'], req.headers['token_key'] as string) as Auth;
        return auth;
    }
}