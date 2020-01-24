import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';
import { UserDataObj } from '../../interfaces/types';

export class Account {

    public router: Router;
    constructor(private express) {
        this.init();
    }
    private init(): void {
        this.router = this.express.Router();
        this.router.get('/account', async (req, res, next) => {
            let username: string;
              if (!req.headers['authorization']) {
                return res.sendStatus(401);
              }
              try {
                  username = jwt.decode(req.headers['authorization'], req.headers['token_key'] as string).username;
              } catch (err) {
                  return res.sendStatus(401);
              }

              try {
                const authParams = {
                    $or: [
                      {username: username},
                      {email: username}
                    ]
                  };
                const user: UserDataObj = await datareader(User, authParams, MongoActions.FIND_ONE);
                res.json(user);
              } catch (error) {
                console.error('/account', error);
                res.status(500).json({error, status: 500});
              }
          });
    }
}
