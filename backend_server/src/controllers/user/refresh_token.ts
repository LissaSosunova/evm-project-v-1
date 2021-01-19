import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import { cookiesToObject } from '../../modules/cookies-Parser';
import { settings } from '../../config';
import { Auth, LoginResponse } from '../../interfaces/types';
import { datareader } from '../../modules/datareader';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';

export class RefreshAccessToken {

    public async getNewToken(req: Request, res: Response): Promise<Response> {
        const cookiesObj = cookiesToObject(req.headers.cookie);
        if (!cookiesObj) {
            return res.sendStatus(401);
        }
        const {refresh_token} = cookiesObj;
        let auth: Auth;
        try {
            auth = jwt.verify(refresh_token, settings.secretKeyForRefreshToken) as Auth;
        } catch (error) {
            return res.status(401);
        }
        const token_key: string = crypto.randomBytes(20).toString('hex');
        const {username, id} = auth;
        try {
            const response = await datareader(User, {_id: id}, MongoActions.FIND_ONE);
            if (response === null) {
                return res.sendStatus(403);
            }
            const access_token: string = jwt.sign({username, id}, token_key, {expiresIn: settings.tokenExpiration});
            res.cookie('access_token', access_token, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: settings.tokenExpiration * 1000
            });
            res.cookie('token_key', token_key, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: settings.tokenExpiration * 1000
            });
            return res.json({
                    success: true,
                    access_token,
                    token_key,
                    expires_in: settings.tokenExpiration
                } as LoginResponse);
        } catch (error) {
            console.error('/refresh_token', error);
            return res.status(500).json({error, status: 500});
        }

    }
}
