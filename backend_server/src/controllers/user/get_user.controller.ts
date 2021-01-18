import { Request, Response } from 'express';
import { AuthToken } from '../../abstract_classes/auth_abstract';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Auth, ChatDb, Chats, DbQuery, Message, UserDataObj } from '../../interfaces/types';
import { User } from '../../models/user';
import { datareader } from '../../modules/datareader';
import { UserData } from '../../modules/userData';
import { ObjectId } from 'mongodb';
import { Chat } from '../../models/chats';

export class GetUserController extends AuthToken {

    public async user(req: Request, res: Response): Promise<void> {
        const auth: Auth = this.checkToken(req);
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
    }

}
