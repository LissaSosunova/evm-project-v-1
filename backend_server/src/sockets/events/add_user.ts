import { User } from '../../models/user';
import { datareader } from '../../modules/datareader';
import { OnlineClients, AddUserScoketIo, UserDataObj } from '../../interfaces/types';
import * as socketIo from 'socket.io';
import { MongoActions } from '../../interfaces/mongo-actions';
import { ContactData } from '../../modules/contactData';

export function addUser(socket: socketIo.Socket, onlineClients: OnlineClients): void {
    socket.on('add_user', async (obj: AddUserScoketIo) => {
        if (obj.queryUserId === obj.userId) {
          return;
        }
        let exsistCont = false;
        const queryParamDb = {
            username: obj.userId
        };

        try {
          const result: UserDataObj = await datareader(User, queryParamDb, MongoActions.FIND_ONE);
          exsistCont = result.contacts.some(item => {
            return item.id === obj.queryUserId;
         });
          if (exsistCont) {
            return;
          }
          const findRes: UserDataObj = await datareader(User, {username: obj.queryUserId}, MongoActions.FIND_ONE);
          findRes.private_chat = '0';
          findRes.status = 3;
          const contact: ContactData = new ContactData(findRes);
          const updateParams = {
            query: {username: obj.userId},
            objNew:  {$push: {contacts: contact}}
          };
          const updateRes = await datareader(User, updateParams, MongoActions.UPDATE_ONE);
          // добавить найденому другу тоже со статусом ожидания подтверждения с его стороны
          const params2 = {
            $or: [
              {username: contact.id},
              {email: contact.email}
            ]
          };
          const result2 = new ContactData(result);
          result2.private_chat = '0';
          result2.status = 2;
          const addParams = {
            query: params2,
            objNew:  {$push: {contacts: result2}}
          };
          const updateFindedUser = await datareader(User, addParams, MongoActions.UPDATE_ONE);
          if (onlineClients[obj.queryUserId]) {
            Object.keys(onlineClients[obj.queryUserId]).forEach(token => {
              onlineClients[obj.queryUserId][token].emit('add_user_request', result2);
            });
          }
          if (onlineClients[obj.userId]) {
            Object.keys(onlineClients[obj.userId]).forEach(token => {
              onlineClients[obj.userId][token].emit('add_user', contact);
            });
          }
        } catch (error) {
          console.error ('add_user', error);
          if (onlineClients[obj.userId]) {
            Object.keys(onlineClients[obj.userId]).forEach(token => {
              onlineClients[obj.userId][token].emit('error', {event: 'add_user', error});
            });
          }
        }

      });
}
