import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import * as bcrypt from 'bcrypt';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';
import { Server200Response, ChangePasswordAuthObj, Auth } from '../../interfaces/types';

export class ChangePasswordAuth {

    public router: Router;
    constructor(private express) {
        this.init();
    }

    private init(): void {
        this.router = this.express.Router();
        this.router.post('/change_password_auth', async (req, res, next) => {
            let auth: Auth;
            const reqObj: ChangePasswordAuthObj = req.body;
            if (!req.headers['authorization']) {
                return res.sendStatus(401);
            }
            try {
                auth = jwt.decode(req.headers['authorization'], req.headers['token_key'] as string);
            } catch (err) {
                return res.status(401).json(err);
            }
            const authParams = {
                $or: [
                    {username: auth.username},
                    {email: auth.username}
                ]
            };
            const {oldPassword, newPassword} = reqObj;
            try {
                const user: {_id: string, password: string} = await datareader(User, authParams, MongoActions.FIND_WITH_PASSWORD);
                bcrypt.compare(oldPassword, user.password, (err, valid) => {
                    if (err) {
                        console.error('error in bcrypt.compare', err);
                        return res.status(500);
                    } else if (!valid) {
                        return res.json({message: 'Incorrect password', status: 400} as Server200Response);
                    } else {
                        bcrypt.hash(newPassword, 10, async (error, hash) => {
                            if (error) {
                                console.error('error in bcrypt hash', error);
                                return res.status(500);
                            } else {
                                await datareader(User, {query: authParams, objNew: {password: hash}}, MongoActions.UPDATE_ONE);
                                return res.json({message: 'password was changed', status: 200} as Server200Response);
                            }
                        });
                    }
                });
            } catch (error) {
                console.error('/change_password_auth', error);
                res.status(500).json({error, status: 500});
            }
        });
    }

}
