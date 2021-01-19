import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {User} from '../../models/user';
import * as crypto from 'crypto';
import { LoginResponse, UserDataObj } from '../../interfaces/types';
import { settings } from '../../config';
import { Request, Response } from 'express';
import { datareader } from '../../modules/datareader';
import { MongoActions } from '../../interfaces/mongo-actions';

export class LoginController {

    constructor() {}

    public login(req: Request, res: Response): Response {
        let username: string;
        let password: string;
        if (!req.body.username || !req.body.password) {
            return res.sendStatus(400);
        } else {
            username = req.body.username;
            password = req.body.password;
            const params = {
                $or: [
                  {username: username},
                  {email: username}
                ]
            };
            User.findOne(params)
            .select('password')
            .exec((err, user) => {
                if (err) {
                    return res.status(500).json({err});
                }
                if (!user) {
                    return res.json({message: 'Incorrect user'}).status(401);
                }
                bcrypt.compare(password, (user as any).password, async (error, valid) => {
                if (err) {
                    return res.status(500).json({error});
                }
                if (!valid) {
                    return res.json({message: 'Incorrect password'}).status(401);
                }
                const response: UserDataObj = await datareader(User, params, MongoActions.FIND_ONE);
                const token_key: string = crypto.randomBytes(20).toString('hex');
                const forToken = {
                    username: response.username,
                    id: response._id,
                };
                const access_token: string = jwt.sign(forToken, token_key, {expiresIn: settings.tokenExpiration});
                const refreshToken: string = jwt.sign(forToken, settings.secretKeyForRefreshToken);
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
                res.cookie('refresh_token', refreshToken, {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'strict',
                });
                res.json({
                    success: true,
                    access_token,
                    token_key,
                    expires_in: settings.tokenExpiration
                    } as LoginResponse);
                });
            });
        }
    }
}
