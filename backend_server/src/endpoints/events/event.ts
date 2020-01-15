import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Event } from '../../models/event'
import { EventDb } from '../../interfaces/types';

export class GetEvent {
    public router: Router;
    constructor(private express) {
        this.init();
    }

    private init(): void {
        this.router = this.express.Router();
        this.router.get('/event/:id/', function (req, res, next) {
            let auth;
            if (!req.headers['authorization']) {
              return res.sendStatus(401);
            }
            try {
              auth = jwt.decode(req.headers['authorization'], req.headers['token_key'] as string);
            } catch (err) {
              return res.sendStatus(401);
            }
            Event.findOne({
              $or: [
                {_id: req.params.id},
                {name: req.params.name} // не вижу, где ты передаёшь name в url
              ]
            }, function(error, event: EventDb) {
              if (error) {
                return res.status(500).json({error});
              } else {
                return res.json(event);
              }
            });
          });
    }
}
