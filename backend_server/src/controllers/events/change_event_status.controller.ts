import { Request, Response } from 'express';
import { datareader } from '../../modules/datareader';
import { AuthToken } from '../../abstract_classes/auth_abstract';
import { Auth, Server200Response, UserDataObj } from '../../interfaces/types';
import { User } from '../../models/user';
import { MongoActions } from '../../interfaces/mongo-actions';

export class ChangeEventStatusController extends AuthToken {

    public changeStatus(req: Request, res: Response): void {
        const auth: Auth = this.checkToken(req);
        const eventId: string = req.params.eventId;
        const params = {
          $or: [
            {username: auth.username},
            {email: auth.username}
          ]
        };
        datareader(User, params, MongoActions.FIND_ONE)
          .then((response: UserDataObj) => {
            User.updateOne({'username' : response.username, 'notifications.id' : eventId},
              {
                $set : { 'notifications.$.status' : false }
              }, { upsert: true },
              function(err, result) {
              }
            );
            return res.json({status: 200, message: 'Status was changed'} as Server200Response);
          });
    }
}