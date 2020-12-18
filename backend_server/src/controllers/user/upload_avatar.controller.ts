import { Request, Response } from 'express';
import { AuthToken } from '../../abstract_classes/auth_abstract';
import * as fs from 'fs';
import * as path from 'path';
import { Auth, Avatar, DbQuery } from '../../interfaces/types';
import { datareader } from '../../modules/datareader';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';

export class UploadAvatarController extends AuthToken {

    public async uploadAvatar(req: Request, res: Response): Promise<void> {
        let auth: Auth = this.checkToken(req);
        
        const params = {
          $or: [
            {username: auth.username},
            {email: auth.username}
          ]
        };
        try {
            const img = fs.readFileSync((req as any).file.path);
            const encode_image = img.toString('base64');
            // BASE64 object
            const finalImg = {
            contentType: (req as any).file.mimetype,
            image: new Buffer(encode_image, 'base64')
            };
            const avatarObjToSave = {
                owner: req.headers.userid,
                avatar: finalImg
            };
            const queryParam: DbQuery = {
                query: params,
                objNew: {$set: {avatar : avatarObjToSave}}
            };
            const updateAvatarInContacts: DbQuery = {
                query: { 'contacts.id': req.headers.userid},
                objNew: {
                    $set : { 'contacts.$.avatar' : avatarObjToSave }
                }
            };
            const updateAvatarInChats: DbQuery = {
                query: {'chats.id': req.headers.userid},
                objNew: {
                    $set : {'chats.$.avatar' : avatarObjToSave }
                }
            };
            const queryParams: DbQuery = {
                query: {$or: [
                {username: auth.username},
                {email: auth.username}
                ]},
                elementMatch: {avatar: 1}
            };
            await datareader(User, queryParam, MongoActions.UPDATE_ONE);
            await datareader(User, updateAvatarInContacts, MongoActions.UPDATE_MANY);
            await datareader(User, updateAvatarInChats, MongoActions.UPDATE_MANY);
            const savedAvatar: {_id: string, avatar: Avatar}[] = await datareader(User, queryParams, MongoActions.FIND_ELEMENT_MATCH);
            fs.readdir(path.join(__dirname, `../../../uploads/${req.headers.userid}/avatars/`), (err, items) => {
                items.forEach((file) => {
                    fs.unlinkSync(path.join(__dirname, `../../../uploads/${req.headers.userid}/avatars/${file}`));
                });
                fs.rmdirSync(path.join(__dirname, `../../../uploads/${req.headers.userid}/avatars/`));
            });
            res.json(savedAvatar[0].avatar);
        } catch (error) {
            console.error('/upload_avatar', error);
            res.status(500).json({error, status: 500});
        }
    }

}