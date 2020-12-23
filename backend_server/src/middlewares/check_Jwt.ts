import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export function verifyToken(req: Request, res: Response, next: NextFunction): Response {
    try {
        jwt.verify(req.headers['authorization'], req.headers['token_key'] as string);
    } catch (error) {
        return res.sendStatus(401);
    }
    next();
}
