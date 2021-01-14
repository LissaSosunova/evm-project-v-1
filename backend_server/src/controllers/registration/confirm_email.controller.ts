import { Request, Response } from 'express';
import * as jwt from 'jwt-simple';
import { settings as config} from '../../config';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Avatar, PendingRegUser } from '../../interfaces/types';
import { ConfUser } from '../../models/pending_registration_user';
import { User } from '../../models/user';
import { datareader } from '../../modules/datareader';

export class ConfirmEmailController {

    public async confirm(req: Request, res: Response): Promise<void> {
        try {
            const token: string = req.params.token;
            const auth: {email: string} = jwt.decode(token, config.secretkeyForEmail);
            const pendingUser: PendingRegUser = await datareader(ConfUser, auth, MongoActions.FIND_ONE);
            if (pendingUser == null) {
                res.status(404).json({message: 'User is not found', status: 404});
            } else {
                const pendingUserPassword: {password: string} = await datareader(ConfUser, auth, MongoActions.FIND_WITH_PASSWORD);
                const defaultAvatar: Avatar = {
                    owner: 'default',
                    url: 'assets/img/default-profile-image.png'
                };
                const user = new User;
                user.username = pendingUser.username;
                user.password = pendingUserPassword.password;
                user.email = pendingUser.email;
                user.name = pendingUser.name;
                user.phone = 'Set your phone number';
                user.avatar = defaultAvatar;
                user.events = [];
                user.notifications = [];
                user.chats = [];
                await Promise.all([
                    datareader(user as any, null, MongoActions.SAVE),
                    datareader(ConfUser, auth, MongoActions.DELETE_ONE),
                ]);
                res.redirect(`${config.frontendDomain}/registration/email-confirmed`);
            }
        } catch (error) {
            console.error('/confirm_email', error);
            res.status(500).json({error, status: 500});
        }
    }
} 