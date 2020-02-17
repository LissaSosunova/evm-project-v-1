import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';
import { ObjectId } from 'mongodb';
import { UserData } from '../../modules/userData';
import { Chat } from '../../models/chats';
import { UserDataObj, Chats, ChatDb, Message, Auth, DbQuery } from '../../interfaces/types';

export class GetUser {

    public router: Router;
    constructor(private express) {
        this.init();
    }

    private init(): void {
        this.router = this.express.Router();
        this.router.get('/user', async (req, res, next) => {
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
            try {
              const userDb: UserDataObj = await datareader(User, params, MongoActions.FIND_ONE);
              const user: UserData = new UserData(userDb);
              const chatList: Chats[] = userDb.chats;
              const promisesUnreadNum: Promise<{_id: string, query: []}[]>[] = [];
              const promisesLastMes: Promise<ChatDb>[] = [];
              chatList.forEach(chat => {
                if (chat.chatId) {
                  const queryParams: DbQuery = {
                    query: {'_id' : new ObjectId(chat.chatId)},
                    queryField1: 'messages',
                    queryField2: 'unread',
                    contidition:  user.username
                  };
                  const queryParamsForLastMes: DbQuery = {
                    query: {'_id' : new ObjectId(chat.chatId)},
                    elementMatch: {messages: {$slice: [0, 1]}}
                  };
                promisesUnreadNum.push(datareader(Chat, queryParams, MongoActions.ARRAY_FILTER));
                promisesLastMes.push(datareader(Chat, queryParamsForLastMes, MongoActions.FIND_ONE_ELEMENT_MATCH));
                }
              });
              const unreadMes: {_id: string, query: Message[]}[][] = await Promise.all(promisesUnreadNum);
              const lastMes: ChatDb[] = await Promise.all(promisesLastMes);
              const unreadNumInChats = [];
              unreadMes.forEach(item => {
                const obj = {} as {chatId: string, unreadMes: number};
                if (item && item.length > 0) {
                  obj.chatId = String(item[0]._id);
                  obj.unreadMes = item[0].query.length;
                  unreadNumInChats.push(obj);
                }
              });
              user.chats.forEach(item => {
                unreadNumInChats.forEach(el => {
                  if (item.chatId && item.chatId === el.chatId) {
                    item.unreadMes = el.unreadMes;
                  }
                });
                lastMes.forEach(el => {
                  if (el && item.chatId && item.chatId === String(el._id)) {
                    item.lastMessage = el.messages[0];
                  }
                });
              });
              res.json(user);
            } catch (error) {
              console.error('/user', error);
              res.status(500).json({error, status: 500});
            }
          });
    }
}
