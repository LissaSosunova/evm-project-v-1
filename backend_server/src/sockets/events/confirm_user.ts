import { User } from '../../models/user';
import { datareader } from '../../modules/datareader';
import { OnlineClients, AddUserScoketIo, UserDataObj, DbQuery, ChatType } from '../../interfaces/types';
import * as socketIo from 'socket.io';
import { MongoActions } from '../../interfaces/mongo-actions';

export function confirmUser(socket: socketIo.Socket, onlineClients: OnlineClients): void {
    socket.on('confirm_user', async (obj: AddUserScoketIo) => {
        if (obj.queryUserId === obj.userId) {
          return;
        }
        const params1 = {username: obj.userId};
        const params2 = {username: obj.queryUserId};
        try {
          const response2: UserDataObj = await datareader(User, params2, MongoActions.FIND_ONE);
          const update2: DbQuery = {
            query: {'username' : response2.username, 'contacts.id': obj.userId},
            objNew: {$set : {'contacts.$.status' : ChatType.PRIVATE_CHAT }}
          };
          await datareader(User, update2, MongoActions.UPDATE_ONE );
          const response1 = await datareader(User, params1, MongoActions.FIND_ONE);
          const update1: DbQuery = {
            query: {'username' : response1.username, 'contacts.id': obj.queryUserId},
            objNew: {$set : { 'contacts.$.status' : ChatType.PRIVATE_CHAT }}
          };
          await datareader(User, update1, MongoActions.UPDATE_ONE);
          if (onlineClients[obj.queryUserId]) {
            Object.keys(onlineClients[obj.queryUserId]).forEach(token => {
              onlineClients[obj.queryUserId][token].emit('confirm_user_request', {userId: obj.userId});
            });
          }
          if (onlineClients[obj.userId]) {
            Object.keys(onlineClients[obj.userId]).forEach(token => {
              onlineClients[obj.userId][token].emit('confirm_user', {userId: obj.queryUserId});
            });
          }

        } catch (error) {
          console.error('confirm_user', error);
          if (onlineClients[obj.userId]) {
            Object.keys(onlineClients[obj.userId]).forEach(token => {
              onlineClients[obj.userId][token].emit('error', {event: 'confirm_user', error});
            });
          }
        }
      });
}
