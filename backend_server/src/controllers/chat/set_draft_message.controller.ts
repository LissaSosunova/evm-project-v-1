import { Request, Response } from 'express';
import { datareader } from '../../modules/datareader';
import { AuthToken } from '../../abstract_classes/auth_abstract';
import { Auth, ChatDb, DbQuery, DraftMessageDb, Server200Response } from '../../interfaces/types';
import { Chat } from '../../models/chats';
import { MongoActions } from '../../interfaces/mongo-actions';

export class SetDraftMessageController extends AuthToken {

    public async setMessage(req: Request, res: Response): Promise<void> {
        // let auth: Auth = this.checkToken(req);
        const reqObj: DraftMessageDb = req.body;
        const deleteDraftMessParams: DbQuery = {
          query: {'_id' : reqObj.chatID},
          objNew: {$pull: {draftMessages: {authorId: reqObj.authorId}}}
        };
        const updateParams: DbQuery = {
          query: {'_id' : reqObj.chatID},
          objNew: {$push: {'draftMessages': reqObj}}
        };
        const queryParams = {
          _id: reqObj.chatID, 'draftMessages.authorId': reqObj.authorId
        };
        try {
          const findDraftMes: ChatDb = await datareader(Chat, queryParams, MongoActions.FIND_ONE);
          if (findDraftMes == null) {
            await datareader(Chat, updateParams, MongoActions.UPDATE_ONE);
          } else {
            await Promise.all([
              datareader(Chat, deleteDraftMessParams, MongoActions.UPDATE_ONE),
              datareader(Chat, updateParams, MongoActions.UPDATE_ONE)
            ]);
          }
          res.json({status: 200, message: 'message saved'} as Server200Response);
        } catch (error) {
          console.error('/set_draft_message', error);
          res.status(500).json({error, status: 500});
        }
    }
}