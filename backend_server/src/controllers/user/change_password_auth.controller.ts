import { Request, Response } from 'express';
import { AuthToken } from '../../abstract_classes/auth_abstract';
import { Auth, ChangePasswordAuthObj, Server200Response } from '../../interfaces/types';
import { MongoActions } from '../../interfaces/mongo-actions';
import { datareader } from '../../modules/datareader';
import { User } from '../../models/user';
import * as bcrypt from 'bcrypt';

export class ChangePasswordAuthController extends AuthToken {

    public async changePassword(req: Request, res: Response): Promise<void> {
        let auth: Auth;
        const reqObj: ChangePasswordAuthObj = req.body;
        auth = this.checkToken(req);
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
    }

}
