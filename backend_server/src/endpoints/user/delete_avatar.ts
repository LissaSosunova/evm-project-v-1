import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';
import { Avatar, Auth, DbQuery } from '../../interfaces/types';

export class DeleteAvatar {

    public router: Router;
    constructor(private express) {
        this.init();
    }
    private init(): void {
        this.router = this.express.Router();
        this.router.post('/delete_avatar', async (req, res, next) => {
            let auth: Auth;
              if (!req.headers['authorization']) {
              return res.sendStatus(401);
            }
            try {
              auth = jwt.decode(req.headers['authorization'], req.headers['token_key'] as string);
            } catch (err) {
              return res.sendStatus(401);
            }
            const params = {
              $or: [
                {username: auth.username},
                {email: auth.username}
              ]
            };
          const userId: string = req.body.userId;
          const avatarObjToSave: Avatar = {
                owner: 'default',
                url: `assets/img/default-profile-image.png`
            };
            const queryParam: DbQuery = {
                query: params,
                objNew: {$set: {avatar : avatarObjToSave}}
            };
            const updateAvatarInContacts: DbQuery = {
                query: { 'contacts.id': userId},
                objNew: {
                    $set : { 'contacts.$.avatar' : avatarObjToSave }
                }
            };
            const updateAvatarInChats: DbQuery = {
                query: {'chats.id': userId},
                objNew: {
                    $set : { 'chats.$.avatar' : avatarObjToSave }
                }
            };
            try {
                await datareader(User, queryParam, MongoActions.UPDATE_ONE);
                await datareader(User, updateAvatarInContacts, MongoActions.UPDATE_MANY);
                await datareader(User, updateAvatarInChats, MongoActions.UPDATE_MANY);
                res.json(avatarObjToSave);
            } catch (error) {
                console.error('/delete_avatar', error);
                res.status(500).json({error, status: 500});
            }
        });
    }
}
