import { Request, Response } from 'express';
import { datareader } from '../../modules/datareader';
import { AuthToken } from '../../abstract_classes/auth_abstract';
import { Auth, EventDb } from '../../interfaces/types';
import { Event } from '../../models/event'

export class GetEventsController extends AuthToken {

    public getEvents(req: Request, res: Response): void {
        let auth: Auth = this.checkToken(req);
        
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
    }

}