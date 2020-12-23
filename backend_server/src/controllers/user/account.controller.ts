import { Request, Response } from 'express';
import { AuthToken } from '../../abstract_classes/auth_abstract';
import { MongoActions } from '../../interfaces/mongo-actions';
import { UserDataObj } from '../../interfaces/types';
import { User } from '../../models/user';
import { datareader } from '../../modules/datareader';

export class AccountController extends AuthToken {

  constructor() {
    super();
  }

    public async account (req: Request, res: Response) {
        let username: string;
        username = this.checkToken(req).username;
        try {
          const authParams = {
              $or: [
                {username},
                {email: username}
              ]
            };
          const user: UserDataObj = await datareader(User, authParams, MongoActions.FIND_ONE);
          res.json(user);
        } catch (error) {
          console.error('/account', error);
          res.status(500).json({error, status: 500});
        }
    }
}