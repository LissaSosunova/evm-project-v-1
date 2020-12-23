import { Request, Response } from 'express';
import { datareader } from '../../modules/datareader';
import { AuthToken } from '../../abstract_classes/auth_abstract';
import { Auth, DbQuery } from '../../interfaces/types';
import { Chat } from '../../models/chats';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';

export class RenewChatController extends AuthToken {

    public async renewChat(req: Request, res: Response): Promise<void> {
        let auth: Auth = this.checkToken(req);;
        let chatId: {_id: string}[];
        const contactId: string = req.params.contactId;
        const params: DbQuery = {
          query: {$and: [{users: auth.username}, {users: contactId}]},
          elementMatch: {_id: 1}
        };
        try {
          chatId = await datareader(Chat, params, MongoActions.FIND_ELEMENT_MATCH);
          const renewChatParams: DbQuery = {
            query: {'username' : auth.username, 'contacts.id' : contactId},
            objNew: {$set : { 'contacts.$.private_chat' : chatId[0]._id }}
            // возвращаем id чата в документ
          };
          await datareader(User, renewChatParams, MongoActions.UPDATE_ONE);
          const response: {chatId: string} = {
            chatId: chatId[0]._id
          };
          res.json(response);
        } catch (error) {
          console.error('/renew_chat', error);
          res.status(500).json({error, status: 500});
        }
    }

}