import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';
import { Server200Response, DeleteDraftMessageObj, Auth } from '../../interfaces/types';

export class DeleteDraftMessage {
    public router: Router;
    constructor(private express) {
        this.init();
    }

    private init(): void {
        this.router = this.express.Router();
        this.router.post('/delete_draft_message', async (req, res, next) => {
            if (!req.headers['authorization']) {
                return res.sendStatus(401);
              }
              let auth: Auth;
              try {
                auth = jwt.decode(req.headers['authorization'], req.headers['token_key'] as string);
              } catch (err) {
                return res.sendStatus(401);
              }
              const reqObj: DeleteDraftMessageObj = req.body;
              const deleteDraftMessParams = {
                query: {'_id' : reqObj.chatID},
                objNew: {$pull: {draftMessages: {authorId: reqObj.authorId}}}
              };
              try {
                await datareader(Chat, deleteDraftMessParams, MongoActions.UPDATE_ONE);
                res.json({status: 200, message: 'message was deleted'} as Server200Response);
              } catch (error) {
                console.error('/delete_draft_message', error);
                res.status(500).json({error, status: 500});
              }
        });
    }
}
