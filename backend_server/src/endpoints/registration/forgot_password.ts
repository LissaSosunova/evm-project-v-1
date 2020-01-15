import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';
import { settings as config} from '../../config';
import { transporter } from '../../modules/transporterNodemailer';
import { Server200Response, UserDataObj } from '../../interfaces/types';

export class ForgotPassword {
    public router: Router;
    constructor(private express) {
        this.init();
    }
    private init(): void {
        this.router = this.express.Router();
        this.router.post('/forgot_password', async (req, res, next) => {
            const email: string = req.body.email;
            try {
                const emailInDb: UserDataObj = await datareader(User, {email}, MongoActions.FIND_ONE);
                if (emailInDb == null) {
                    res.json({message: 'Email is not found', status: 404});
                } else {
                    const token: string = jwt.encode(emailInDb.username, config.secretkeyForPasswordReset);
                    const tokenTime: number = Date.now();
                    const url = `${config.backendDomain}/reset_password/${token}/${tokenTime}`;
                        await transporter.sendMail({
                            from: 'event-messenger',
                            to: email,
                            subject: 'Forgot password',
                            text: 'Reset password',
                            html: `Please click this link to reset your password: <a href="${url}">${url}</a>
                                    <br> This link is valid during 10 minutes`
                        });
                        res.json({message: 'Email was sent', status: 200} as Server200Response);
                }
            } catch (error) {
                console.error('/forgot_password', error);
                res.status(500).json({error});
            }
        });
    }
}
