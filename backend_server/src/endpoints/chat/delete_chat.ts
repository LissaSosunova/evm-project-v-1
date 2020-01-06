import * as jwt from 'jwt-simple';
import {User} from '../../models/user';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { DeleteChatObj, Server200Response } from '../../interfaces/types';

export class DeleteChat {
    public router: Router;
    constructor(private express) {
       this.init();
    }

    private init(): void {
        this.router = this.express.Router();
        this.router.post('/delete_chat', async (req, res, next) => {
            let auth;
            if (!req.headers['authorization']) {
              return res.sendStatus(401);
            }
            try {
              auth = jwt.decode(req.headers['authorization'], req.headers['token_key'] as string);
            } catch (err) {
              return res.sendStatus(401);
            }
            const dataObj: DeleteChatObj = req.body;
            const deleteChatParams = {
              query: {'username' : dataObj.myId, 'contacts.id' : dataObj.contactId},
              objNew: {$set : { 'contacts.$.private_chat' : '-1' }}
            };
            const params = {
              query: {username: dataObj.myId},
              objNew: {$pull: {chats: {id: dataObj.contactId}}}
            };
            try {
              const deleteChat = await datareader(User, deleteChatParams, MongoActions.UPDATE_ONE);
              const updateRes = await datareader(User, params, MongoActions.UPDATE_ONE);
            } catch (error) {
              console.error('/delete_chat', error);
              return res.status(500).json({error});
            }
            res.json({message: 'Chat was deleted!', status: 200} as Server200Response);
        });
    }

}
