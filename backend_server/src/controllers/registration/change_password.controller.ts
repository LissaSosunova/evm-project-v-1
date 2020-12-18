import { Request, Response } from 'express';
import { ChangePasswordObj, Server200Response } from '../../interfaces/types';
import { datareader } from '../../modules/datareader';
import * as jwt from 'jwt-simple';
import * as bcrypt from 'bcrypt';
import { settings as config} from '../../config';
import { User } from '../../models/user';
import { MongoActions } from '../../interfaces/mongo-actions';

export class ChangePasswordController {

    public async changePassword(req: Request, res: Response): Promise<Response> {
        let username: string;
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
                        res.status(500).json({error, status: 500});
                    }
                }
            });
        }        
    }
}
