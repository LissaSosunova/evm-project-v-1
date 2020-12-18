import { Request, Response } from 'express';
import * as jwt from 'jwt-simple';
import { MongoActions } from '../../interfaces/mongo-actions';
import { DbQuery, Server200Response } from '../../interfaces/types';
import { User } from '../../models/user';
import { datareader } from '../../modules/datareader';
import { settings as config} from '../../config';
import { Chat } from '../../models/chats';

export class ConfirmChangeEmailController {

    public async confirm(req: Request, res: Response): Promise<Response> {
        const token: string = req.params.token;
        const newEmail: string = req.params.email;
        const tokenTime: number = +req.params.tokenTime;
        const dateNow: number = Date.now();
        if (dateNow - tokenTime > config.expireChangeEmailLink) {
            res.status(403).json({message: 'Invalid link', status: 403});
        } else {
            const username: string = jwt.decode(token, config.secretkeyForEmail);
            try {
                const userInDb = await datareader(User, {username}, MongoActions.FIND_ONE);
                if (userInDb) {
                    const newEmailDecoded = jwt.decode(newEmail, config.secretkeyForEmail);
                    const paramsForEmailUpdate: DbQuery = {
                        query: {username},
                        objNew: {$set: {email: newEmailDecoded}}
                    };
                    await datareader(User, paramsForEmailUpdate, MongoActions.UPDATE_ONE);
                    const paramsForEmailUpdateInContacts: DbQuery = {
                        query: {
                            'contacts.id': username,
                        },
                        objNew: {
                            $set: {
                                'contacts.$.email': newEmailDecoded
                            }
                        }
                    };
                    await datareader(User, paramsForEmailUpdateInContacts, MongoActions.UPDATE_MANY);
                    const paramsForEmailUpdateInChats: DbQuery = {
                        query: {
                            'users.username': username
                        },
                        objNew: {
                            $set: {
                                'users.$.email': newEmailDecoded
                            }
                        }
                    };
                    await datareader(Chat, paramsForEmailUpdateInChats, MongoActions.UPDATE_MANY);
                    res.json({message: 'Email was updated', status: 200} as Server200Response);
                    // res.redirect(`${config.frontendDomain}/......`);
                } else {
                    return res.status(404).json({message: 'User is not found', status: 404});
                }
            } catch (error) {
                console.error('confirm_change_email', error);
                res.status(500).json({error, status: 500});
            }
        }
    }
}
