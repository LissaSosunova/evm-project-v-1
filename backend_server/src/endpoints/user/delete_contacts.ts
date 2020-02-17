import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';
import { Server200Response, DeleteContactObj, Auth, DbQuery } from '../../interfaces/types';

export class DeleteContact {

    public router: Router;
    constructor(private express) {
        this.init();
    }

    private init(): void {
        this.router = this.express.Router();
        this.router.post('/delete_contact', async (req, res, next) => {
            let auth: Auth;
            if (!req.headers['authorization']) {
              return res.sendStatus(401);
            }
            try {
              auth = jwt.decode(req.headers['authorization'], req.headers['token_key'] as string);
            } catch (err) {
              return res.sendStatus(401);
            }
            const dataObj: DeleteContactObj = req.body;
            const params: DbQuery = {
              query: {username: dataObj.username},
              objNew: {$pull: {contacts: {id: dataObj.contactUsername}}}
            };
            try {
              await datareader(User, params, MongoActions.UPDATE_ONE);
              res.json({message: 'Contact was deleted', status: 200} as Server200Response);
            } catch (error) {
                console.error('/delete_contact', error);
                res.status(500).json({error, status: 500});
            }
          });
    }
}
