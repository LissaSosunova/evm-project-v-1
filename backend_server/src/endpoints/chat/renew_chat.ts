import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';
import { User } from '../../models/user';
import { DeleteChatObj, DbQuery, Auth } from '../../interfaces/types';

export class RenewChat {
    public router: Router;
    constructor(private express) {
        this.init();
    }

    private init(): void {
        this.router = this.express.Router();
        this.router.post('/renew_chat', async (req, res, next) => {
            let auth: Auth;
            let chatId: {_id: string}[];
            if (!req.headers['authorization']) {
              return res.sendStatus(401);
            }
            try {
              auth = jwt.decode(req.headers['authorization'], req.headers['token_key'] as string);
            } catch (err) {
              return res.sendStatus(401);
            }
            const dataObj: DeleteChatObj = req.body;
            const params = {
              query: {$and: [{users: dataObj.myId}, {users: dataObj.contactId}]},
              elementMatch: {_id: 1}
            };
            try {
              chatId = await datareader(Chat, params, MongoActions.FIND_ELEMENT_MATCH);
              const renewChatParams = {
                query: {'username' : dataObj.myId, 'contacts.id' : dataObj.contactId},
                objNew: {$set : { 'contacts.$.private_chat' : chatId[0]._id }}
                // возвращаем id чата в документ
              };
              const renewChat = await datareader(User, renewChatParams, MongoActions.UPDATE_ONE);
              const response: {chatId: string} = {
                chatId: chatId[0]._id
              };
              res.json(response);
            } catch (error) {
              console.error('/renew_chat', error);
              res.status(500).json({error, status: 500});
            }
          });
    }
}
