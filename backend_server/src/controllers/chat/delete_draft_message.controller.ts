import { Request, Response } from 'express';
import { datareader } from '../../modules/datareader';
import { AuthToken } from '../../abstract_classes/auth_abstract';
import { Auth, DbQuery, Server200Response } from '../../interfaces/types';
import { Chat } from '../../models/chats';
import { MongoActions } from '../../interfaces/mongo-actions';

export class DeleteDraftMessageController extends AuthToken {

    public async delete(req: Request, res: Response): Promise<void> {
        const auth: Auth = this.checkToken(req);
        const authorId = auth.username;
        const chatId = req.params.chatID;
        const deleteDraftMessParams: DbQuery = {
        query: {'_id' : chatId},
        objNew: {$pull: {draftMessages: {authorId}}}
        };
        try {
            await datareader(Chat, deleteDraftMessParams, MongoActions.UPDATE_ONE);
            res.json({status: 200, message: 'message was deleted'} as Server200Response);
        } catch (error) {
            console.error('/delete_draft_message', error);
            res.status(500).json({error, status: 500});
        }
    }
}
