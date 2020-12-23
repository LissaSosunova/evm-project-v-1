import { Request, Response } from 'express';
import { AuthToken } from '../../abstract_classes/auth_abstract';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Auth, DbQuery, Server200Response } from '../../interfaces/types';
import { User } from '../../models/user';
import { datareader } from '../../modules/datareader';

export class DeleteContactController extends AuthToken {

    public async delete(req: Request, res: Response) {
        let auth: Auth = this.checkToken(req);
        const contactUsername = req.params.contactUsername;
        const params: DbQuery = {
            query: {username: auth.username},
            objNew: {$pull: {contacts: {id: contactUsername}}}
        };
        try {
            await datareader(User, params, MongoActions.UPDATE_ONE);
            res.json({message: 'Contact was deleted', status: 200} as Server200Response);
        } catch (error) {
            console.error('/delete_contact', error);
            res.status(500).json({error, status: 500});
        }
    }
}
