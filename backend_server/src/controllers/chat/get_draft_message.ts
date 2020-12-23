import { Request, Response } from 'express';
import { datareader } from '../../modules/datareader';
import { AuthToken } from '../../abstract_classes/auth_abstract';
import { Auth, DbQuery, DraftMessageFromServer } from '../../interfaces/types';
import { Chat } from '../../models/chats';
import { MongoActions } from '../../interfaces/mongo-actions';
import * as url from 'url';
import * as queryString from 'querystring';

export class GetDraftMessageController extends AuthToken {

    public async getMessage(req: Request, res: Response): Promise<void> {
        // let auth: Auth = this.checkToken(req);
        const chatId: string = req.params.chatId;
        const queryParam: string = url.parse(req.url).query;
        const authorId: string = queryString.parse(queryParam).authorId as string;
        const queryParams: DbQuery = {
              query: {_id : chatId},
              elementMatch: {draftMessages: {$elemMatch: {authorId: authorId}}}
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