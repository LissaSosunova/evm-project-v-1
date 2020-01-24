import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';
import * as url from 'url';
import * as queryString from 'querystring';
import { DraftMessageFromServer, Auth } from '../../interfaces/types';

export class GetDraftMessage {
    public router: Router;
    constructor(private express) {
        this.init();
    }
    private init(): void {
        this.router = this.express.Router();
        this.router.get('/get_draft_message/:id/', async (req, res, next) => {
            if (!req.headers['authorization']) {
                return res.sendStatus(401);
              }
              let auth: Auth;
              try {
                auth = jwt.decode(req.headers['authorization'], req.headers['token_key'] as string);
              } catch (err) {
                return res.sendStatus(401);
              }
                const chatId: string = req.params.id;
                const queryParam: string = url.parse(req.url).query;
                const authorId: string = queryString.parse(queryParam).authorId as string;
                const queryParams = {
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
        });
    }
}
