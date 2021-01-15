import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { cookiesToObject } from '../modules/cookies-Parser';

export function verifyToken(req: Request, res: Response, next: NextFunction): Response {
    try {
        const cookiesObj = cookiesToObject(req.headers.cookie);
        const {access_token, token_key} = cookiesObj;
        jwt.verify(access_token, token_key);
    } catch (error) {
        return res.sendStatus(401);
    }
    next();
}
