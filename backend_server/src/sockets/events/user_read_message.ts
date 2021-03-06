import { datareader } from '../../modules/datareader';
import * as socketIo from 'socket.io';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';
import { ObjectId } from 'mongodb';
import { UserReadMessage, Message, OnlineClients, DbQuery, ClientsInChat } from '../../interfaces/types';

export function userReadMessage(socket: socketIo.Socket, onlineClients: OnlineClients, clientsInChat: ClientsInChat): void {
    socket.on('user_read_message', async (obj: UserReadMessage) => {
        const queryParams: DbQuery = {
          query: {'_id' : new ObjectId(obj.chatId)},
          queryField1: 'messages',
          queryField2: 'unread',
          contidition: obj.userId
        };
        try {
          const result: {_id: string, query: Message[]}[] = await datareader(Chat, queryParams, MongoActions.ARRAY_FILTER);
          const promises = [];
          const chatId = result[0]._id;
          const unreadMes = result[0].query;
          unreadMes.forEach(mes => {
            mes.unread = mes.unread.filter(item => item !== obj.userId);
            promises.push(datareader(Chat, {
              query: {'_id': new ObjectId(chatId),
              messages: {$elemMatch: {_id: new ObjectId(mes._id)}}},
              objNew: {$set: {'messages.$.unread': mes.unread}}}, MongoActions.UPDATE_ONE));
          });
          await Promise.all(promises);
          Object.keys(clientsInChat[obj.chatId]).forEach(userId => {
            Object.keys(clientsInChat[obj.chatId][userId]).forEach(token => {
                clientsInChat[obj.chatId][userId][token].emit('user_read_message', obj);
            });
        });
        } catch (error) {
          console.error('user_read_message', error);
          if (onlineClients[obj.userId]) {
            Object.keys(onlineClients[obj.userId]).forEach(token => {
              onlineClients[obj.userId][token].emit('error', {event: 'delete_request', error});
            });
          }
        }
      });

}
