import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';
import { EditProfile, UserDataObj, Auth, DbQuery } from '../../interfaces/types';
import { Chat } from '../../models/chats';

export class Profile {

    public router: Router;
    constructor(private express) {
        this.init();
    }

    private init(): void {
        this.router = this.express.Router();
        this.router.post('/profile', async (req, res, next) => {
            let auth: Auth;
            if (!req.headers['authorization']) {
              return res.sendStatus(401);
            }
            try {
              auth = jwt.decode(req.headers['authorization'], req.headers['token_key'] as string);
            } catch (err) {
              return res.sendStatus(401);
            }
            const params = {
              $or: [
                {username: auth.username},
                {email: auth.username}
              ]
            };
            const editedData: EditProfile = req.body;
            const key: string[] = Object.keys(req.body);
            if (key[0] === 'name') {
              let paramsForNameUpdateInChats:  DbQuery;
              if (auth.username.indexOf('@') === -1) {
                paramsForNameUpdateInChats = {
                  query: {
                      'users.username': auth.username,
                  },
                  objNew: {
                      $set: {
                          'users.$.name': editedData.name
                      }
                  }
              };
              } else {
                paramsForNameUpdateInChats = {
                  query: {
                      'users.email': auth.username
                  },
                  objNew: {
                      $set: {
                          'users.$.name': editedData.name
                      }
                  }
              };
            }
            datareader(Chat, paramsForNameUpdateInChats, MongoActions.UPDATE_MANY)
            .then(r => {
              return datareader(User, params, MongoActions.FIND_ONE);
            })
              .then(response => {
                if (editedData.name && response.name !== editedData.name) {
                  User.updateOne({'username' : response.username},
                    {
                      $set : { 'name' : editedData.name }
                    }, { upsert: true },
                    function(err, result) {
                    }
                  );
                  // update name in contacts arrs
                  User.updateMany({'contacts.id': response.username},
                    {
                      $set : { 'contacts.$.name' : editedData.name }
                    }, { upsert: true },
                    function(err, result) {
                    }
                  );
                  User.updateMany({'chats.id': response.username},
                    {
                      $set : { 'chats.$.name' : editedData.name }
                    }, { upsert: true },
                    function(err, result) {
                    }
                  );
                  return response;
                }
              })
              .then((response: UserDataObj) => {
                return res.json(response);
              });
            } else if (key[0] === 'phone') {
              datareader(User, params, MongoActions.FIND_ONE)
              .then(response => {
                if (editedData.phone && response.phone !== editedData.phone) {
                  User.updateOne({'username' : response.username},
                    {
                      $set : { 'phone' : editedData.phone }
                    }, { upsert: true },
                    function(err, result) {
                    }
                  );
                  return response;
                } return response;
              })
              .then((response: UserDataObj) => {
                // Зачем нам возвращать тут документ с User?
                return res.json(response);
              });
            }
          });
    }
}
