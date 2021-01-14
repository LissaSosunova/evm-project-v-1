import { Request, Response } from 'express';
import { datareader } from '../../modules/datareader';
import { AuthToken } from '../../abstract_classes/auth_abstract';
import { Auth, DbQuery, Server200Response } from '../../interfaces/types';
import { User } from '../../models/user';
import { MongoActions } from '../../interfaces/mongo-actions';

export class DeleteChatController extends AuthToken {

    public async delete(req: Request, res: Response): Promise<Response> {
        let auth: Auth = this.checkToken(req);
            
        const contactId = req.params.contactId;
        const deleteChatParams: DbQuery = {
            query: {'username' : auth.username, 'contacts.id' : contactId},
            objNew: {$set : { 'contacts.$.private_chat' : '-1' }}
        };
        const params: DbQuery = {
              query: {username: auth.username},
              objNew: {$pull: {chats: {id: contactId}}}
        };
        try {
            await Promise.all([
                datareader(User, deleteChatParams, MongoActions.UPDATE_ONE),
                datareader(User, params, MongoActions.UPDATE_ONE)
            ]);
        } catch (error) {
            console.error('/delete_chat', error);
            return res.status(500).json({error, status: 500});
        }
        res.json({message: 'Chat was deleted!', status: 200} as Server200Response);
    }

}