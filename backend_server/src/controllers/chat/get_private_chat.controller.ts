import { Request, Response } from 'express';
import { datareader } from '../../modules/datareader';
import { AuthToken } from '../../abstract_classes/auth_abstract';
import { Auth, ChatDb, DbQuery } from '../../interfaces/types';
import * as url from 'url';
import * as queryString from 'querystring';
import { Chat } from '../../models/chats';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';

export class GetPrivateChatController extends AuthToken {

    public async getChat(req: Request, res: Response): Promise<Response> {
        const auth: Auth = this.checkToken(req);

        try {
          const chatId: string = req.params.chatId;
          const param: string = url.parse(req.url).query;
          const mesAmount: number = +queryString.parse(param).queryMessagesAmount || 20;
          const queryNum: number = +queryString.parse(param).queryNum;
          const mesageShift: number = +queryString.parse(param).messagesShift;
          const n: number = queryNum * mesAmount + mesageShift;
          const getChatParams: DbQuery = {
            query: {_id: chatId},
            elementMatch: {messages: {$slice: [n, mesAmount]}}
          };
          const getUserChat: ChatDb = await datareader(Chat, getChatParams, MongoActions.FIND_ONE_ELEMENT_MATCH);
          if (getUserChat === null) {
            const deleteChatInMyContact: DbQuery = {
              query: {$or: [{username: auth.username, 'chats.chatId': chatId}, {email: auth.username, 'chats.chatId': chatId}]},
              objNew: {$pull: {chats: {chatId}}}
            };
            await datareader(User, deleteChatInMyContact, MongoActions.UPDATE_ONE);
            return res.status(404).json({message: 'Cannot find chat', code: 404});
          }
          if (n > 0) {
            res.json(getUserChat.messages);
          } else {
            res.json(getUserChat);
          }
        } catch (error) {
          console.error(`/private_chat/${req.params.id}`, error);
          res.status(500).json({error, status: 500});
        }
    }
}