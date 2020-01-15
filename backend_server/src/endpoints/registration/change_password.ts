import * as jwt from 'jwt-simple';
import * as bcrypt from 'bcrypt';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';
import { settings as config} from '../../config';
import { Server200Response, ChangePasswordObj } from '../../interfaces/types';

export class ChangePassword {
    public router: Router;
    constructor(private express) {
        this.init();
    }
    private init(): void {
        this.router = this.express.Router();
        this.router.post('/change_password', async (req, res, next) => {
            let username;
            try {
                username = jwt.decode(req.headers['authorization'], config.secretkeyForPasswordReset);
              } catch (err) {
                return res.sendStatus(401);
              }
            const reqObj: ChangePasswordObj =  req.body;
            const tokenTime: number = +reqObj.tokenTime;
            const dateNow: number = Date.now();
            if (dateNow - tokenTime > config.expireResetPasswordLink) {
                res.status(403).json({message: 'Invalid link', status: 403});
            } else {
                const newPassword: string = reqObj.password;
                bcrypt.hash(newPassword, 10, async (err, hash) => {
                    if (err) {
                        res.json(err);
                    } else {
                        try {
                            await datareader(User, {query: {username}, objNew: {password: hash}}, MongoActions.UPDATE_ONE);
                            res.json({message: 'Password changed', status: 200} as Server200Response);
                        } catch (error) {
                            console.error('/change_password', error);
                            res.status(500).json({error});
                        }
                    }
                });
            }
        });
    }
}
