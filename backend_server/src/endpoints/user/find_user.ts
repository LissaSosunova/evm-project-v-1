import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';
import { FindContact } from '../../modules/findContact';
import { Contact, Avatar, Auth, DbQuery } from '../../interfaces/types';

export class FindUser {

    public router: Router;
    constructor(private express) {
        this.init();
    }

    private init(): void {
        this.router = this.express.Router();
        this.router.post('/find_user', async (req, res, next) => {
            let auth: Auth;
            let contact: FindContact;
            const query = req.body.query;
            try {
              auth = jwt.decode(req.headers['authorization'], req.headers['token_key'] as string);
            } catch (err) {
              return res.sendStatus(401);
            }
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
              const userDb: {_id: string, contacts: Contact[]}[] = await datareader(User, params, MongoActions.FIND_ELEMENT_MATCH);
              const result: {_id: string, username: string, email: string, name: string, avatar: Avatar}[] =
              await datareader(User, queryParam, MongoActions.FIND_ELEMENT_MATCH);
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
          });
    }
}
