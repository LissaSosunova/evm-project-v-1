import { Request, Response } from 'express';
import { AuthToken } from '../../abstract_classes/auth_abstract';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Auth, DbQuery, EditProfile, UserDataObj } from '../../interfaces/types';
import { Chat } from '../../models/chats';
import { User } from '../../models/user';
import { datareader } from '../../modules/datareader';

export class ProfileController extends AuthToken {

    public async profile(req: Request, res: Response) {
            let auth: Auth = this.checkToken(req);
          
            const params = {
              $or: [
                {username: auth.username},
                {email: auth.username}
              ]
            };
            const editedData: EditProfile = req.body;
            const key: string[] = Object.keys(req.body);
            if (key[0] === 'name') {
              let paramsForNameUpdateInChats: DbQuery;
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
    }
}