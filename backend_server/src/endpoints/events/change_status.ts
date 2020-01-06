import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';
import { Server200Response, UserDataObj } from '../../interfaces/types';

export class ChangeStatus {
    public router: Router;
    constructor(private express) {
        this.init();
    }

    private init(): void {
        this.router = this.express.Router();
        this.router.post('/change_status', (req, res, next) => {
            let auth;
            if (!req.headers['authorization']) {
              return res.sendStatus(401);
            }
            try {
              auth = jwt.decode(req.headers['authorization'], req.headers['token_key'] as string);
            } catch (err) {
              return res.sendStatus(401);
            }
            const reqObj: {id: string} = req.body;
            const params = {
              $or: [
                {username: auth.username},
                {email: auth.username}
              ]
            };
            datareader(User, params, MongoActions.FIND_ONE)
              .then((response: UserDataObj) => {
                User.updateOne({'username' : response.username, 'notifications.id' : reqObj.id},
                  {
                    $set : { 'notifications.$.status' : false }
                  }, { upsert: true },
                  function(err, result) {
                  }
                );
                return res.json({status: 200, message: 'Status was changed'} as Server200Response);
              });
          });
    }
}
