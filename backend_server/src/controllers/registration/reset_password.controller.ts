import { Request, Response } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Server200Response, UserDataObj } from '../../interfaces/types';
import { User } from '../../models/user';
import { datareader } from '../../modules/datareader';
import { settings as config} from '../../config';
import * as jwt from 'jwt-simple';

export class ResetPasswordController {

    public async reset(req: Request, res: Response): Promise<void> {
        const token: string = req.params.token;
        const tokenTime: number = +req.params.tokenTime;
        const dateNow: number = Date.now();
        if (dateNow - tokenTime > config.expireResetPasswordLink) {
            res.status(403).json({message: 'Invalid link', status: 403} as Server200Response);
        } else {
            const username: string = jwt.decode(token, config.secretkeyForPasswordReset);
            try {
                const user: UserDataObj = await datareader(User, {username}, MongoActions.FIND_ONE);
                if (user === null) {
                    res.status(404).json({message: 'User is not found', status: 404});
                } else {
                    res.redirect(`${config.frontendDomain}/reset-password/${token}/${tokenTime}`);
                }
            } catch (error) {
                console.error('/reset_password', error);
                res.status(500).json({error, status: 500});
            }
        }
    }
}