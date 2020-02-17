import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';
import { DraftMessageDb, Server200Response, ChatDb, Auth, DbQuery } from '../../interfaces/types';

export class SetDraftMessage {
    public router: Router;
    constructor(private express) {
        this.init();
    }

    private init(): void {
        this.router = this.express.Router();
        this.router.post('/set_draft_message', async (req, res, next) => {
            if (!req.headers['authorization']) {
              return res.sendStatus(401);
            }
            let auth: Auth;
            try {
              auth = jwt.decode(req.headers['authorization'], req.headers['token_key'] as string);
            } catch (err) {
              return res.sendStatus(401);
            }
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
                await datareader(Chat, deleteDraftMessParams, MongoActions.UPDATE_ONE);
                await datareader(Chat, updateParams, MongoActions.UPDATE_ONE);
              }
              res.json({status: 200, message: 'message saved'} as Server200Response);
            } catch (error) {
              console.error('/set_draft_message', error);
              res.status(500).json({error, status: 500});
            }
          });
    }
}
