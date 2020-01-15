import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';
import * as url from 'url';
import * as queryString from 'querystring';
import { ChatDb } from '../../interfaces/types';

export class PrivateChat {
    public router: Router;
    constructor(private express) {
        this.init();
    }

    private init(): void {
        this.router = this.express.Router();
        this.router.get('/private_chat/:id/', async (req, res, next) => {
            if (!req.headers['authorization']) {
              return res.sendStatus(401);
            }
            let auth;
            try {
              auth = jwt.decode(req.headers['authorization'], req.headers['token_key'] as string);
            } catch (err) {
              return res.sendStatus(401);
            }
            try {
              const chatId: string = req.params.id;
              const param: string = url.parse(req.url).query;
              const mesAmount: number = +queryString.parse(param).queryMessagesAmount || 20;
              const queryNum: number = +queryString.parse(param).queryNum;
              const mesageShift: number = +queryString.parse(param).messagesShift;
              const n: number = queryNum * mesAmount + mesageShift;
              const getChatParams = {
                query: {_id: chatId},
                elementMatch: {messages: {$slice: [n, mesAmount]}}
              };
              const getUserChat: ChatDb = await datareader(Chat, getChatParams, MongoActions.FIND_ONE_ELEMENT_MATCH);
              if (n > 0) {
                res.json(getUserChat.messages);
              } else {
                res.json(getUserChat);
              }
            } catch (error) {
              console.error(`/private_chat/${req.params.id}`, error);
              res.status(500).json({error});
            }
          });
    }
}
