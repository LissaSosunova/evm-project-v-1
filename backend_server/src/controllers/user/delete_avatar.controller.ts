import { AuthToken } from '../../abstract_classes/auth_abstract';
import { Request, Response } from 'express';
import { Auth, Avatar, DbQuery } from '../../interfaces/types';
import { datareader } from '../../modules/datareader';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';


export class DeleteAvatarController extends AuthToken {

    public async delete(req: Request, res: Response) {
        const auth: Auth = this.checkToken(req);
        const params = {
            $or: [
                {username: auth.username},
                {email: auth.username}
            ]
        };
        const userId: string = req.params.userId;
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
            await Promise.all([
                datareader(User, queryParam, MongoActions.UPDATE_ONE),
                datareader(User, updateAvatarInContacts, MongoActions.UPDATE_MANY),
                datareader(User, updateAvatarInChats, MongoActions.UPDATE_MANY),
            ]);
            res.json(avatarObjToSave);
        } catch (error) {
            console.error('/delete_avatar', error);
            res.status(500).json({error, status: 500});
        }
    }
}