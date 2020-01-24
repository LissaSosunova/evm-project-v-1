import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';
import { Chat } from '../../models/chats';
import { settings as config } from '../../config';
import { Server200Response } from '../../interfaces/types';

export class ConfirmChangeEmail {
    public router: Router;
    constructor(private express) {
        this.init();
    }

    private init(): void {
        this.router = this.express.Router();
        this.router.get('/confirm_change_email/:token/:email/:tokenTime', async (req, res, next) => {

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
                        const paramsForEmailUpdate = {
                            query: {username},
                            objNew: {$set: {email: newEmailDecoded}}
                        };
                        await datareader(User, paramsForEmailUpdate, MongoActions.UPDATE_ONE);
                        const paramsForEmailUpdateInContacts = {
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
                        const paramsForEmailUpdateInChats = {
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
                        return res.json({message: 'User is not found'});
                    }
                } catch (error) {
                    console.error('confirm_change_email', error);
                    res.status(500).json({error, status: 500});
                }
            }
        });
    }
}
