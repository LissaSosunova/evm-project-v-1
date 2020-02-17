import { User } from '../../models/user';
import { datareader } from '../../modules/datareader';
import { OnlineClients, AddUserScoketIo, UserDataObj, DbQuery } from '../../interfaces/types';
import * as socketIo from 'socket.io';
import { MongoActions } from '../../interfaces/mongo-actions';

export function deleteRequest(socket: socketIo.Socket, onlineClients: OnlineClients): void {
    socket.on('delete_request', async (obj: AddUserScoketIo) => {
        const queryParamDb: DbQuery = {
          query: {username: obj.userId},
          objNew: {$pull: {contacts: {id: obj.queryUserId}}}
        };
        const queryDb: DbQuery = {
          query: {username: obj.queryUserId},
          objNew: {$pull: {contacts: {id: obj.userId}}}
        };
        try {
          await datareader(User, queryParamDb, MongoActions.UPDATE_ONE);
          await datareader(User, queryDb, MongoActions.UPDATE_ONE);
          if (onlineClients[obj.queryUserId]) {
            Object.keys(onlineClients[obj.queryUserId]).forEach(token => {
              onlineClients[obj.queryUserId][token].emit('reject_request', {userId: obj.userId});
            });
          }
          if (onlineClients[obj.userId]) {
            Object.keys(onlineClients[obj.userId]).forEach(token => {
              onlineClients[obj.userId][token].emit('delete_request', {userId: obj.queryUserId});
            });
          }
        } catch (error) {
          console.error('delete_request', error);
          if (onlineClients[obj.userId]) {
            Object.keys(onlineClients[obj.userId]).forEach(token => {
              onlineClients[obj.userId][token].emit('error', {event: 'delete_request', error});
            });
          }
        }
      });
}
