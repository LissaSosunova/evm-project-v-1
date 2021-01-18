import { Request, Response } from 'express';
import { datareader } from '../../modules/datareader';
import { AuthToken } from '../../abstract_classes/auth_abstract';
import { Auth, DbQuery, DraftMessageFromServer } from '../../interfaces/types';
import { Chat } from '../../models/chats';
import { MongoActions } from '../../interfaces/mongo-actions';

export class GetDraftMessageController extends AuthToken {

    public async getMessage(req: Request, res: Response): Promise<void> {
        const auth: Auth = this.checkToken(req);
        const authorId = auth.username;
        const chatId: string = req.params.chatId;
        const queryParams: DbQuery = {
              query: {_id : chatId},
              elementMatch: {draftMessages: {$elemMatch: {authorId}}}
          };
        try {
          const result: DraftMessageFromServer[] = await datareader(Chat, queryParams, MongoActions.FIND_ELEMENT_MATCH);
          res.json(result[0]);
        } catch (error) {
          console.error('/get_draft_message/:id', error);
          res.status(500).json({error, status: 500});
        }
    }
}
