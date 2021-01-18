import { Request, Response } from 'express';
import { AuthToken } from '../../abstract_classes/auth_abstract';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Auth, Avatar, Contact, DbQuery } from '../../interfaces/types';
import { User } from '../../models/user';
import { datareader } from '../../modules/datareader';
import { FindContact } from '../../modules/findContact';

export class FindUserController extends AuthToken {

    public async find(req: Request, res: Response): Promise<void> {
        const auth: Auth = this.checkToken(req);
        let contact: FindContact;
        const query = req.query.query;
        const queryParam: DbQuery = {
          query: {$or: [{username: {$regex: query}}, {email: {$regex: query}}, {name: {$regex: query}}]},
          elementMatch: {avatar: 1, username: 1, email: 1, name: 1}
        };
        const params: DbQuery = {
          query: {$or: [
            {username: auth.username},
            {email: auth.username}
          ]},
          elementMatch: {contacts: 1}
        };
        try {
          const [userDb, result]: [
            {_id: string, contacts: Contact[]}[],
            {_id: string, username: string, email: string, name: string, avatar: Avatar}[]
          ] = await Promise.all([
            datareader(User, params, MongoActions.FIND_ELEMENT_MATCH),
            datareader(User, queryParam, MongoActions.FIND_ELEMENT_MATCH)
          ]);
          // убираем из результата поиска те контакты, которые уже есть в списке друзей у пользователья, который шлёт запрос
          const userArr = result.filter(user => {
            return userDb[0].contacts.every(c => c.id !== user.username);
          });
          const resp: FindContact[] = [];
          userArr.forEach(item => {
            if (query !== '' && auth.username !== item.username) {
              contact = new FindContact(item);
              resp.push(contact);
            }
          });
          res.json(resp);
        } catch (error) {
          console.error('/find_user', error);
          res.status(500).json({error, status: 500});
        }
    }

}
