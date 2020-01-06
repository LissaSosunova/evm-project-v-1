import { datareader } from '../../modules/datareader';
import * as socketIo from 'socket.io';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';
import { ObjectId } from 'mongodb';
import { UserReadMessage, Message } from '../../interfaces/types';

export function userReadMessage(socket: socketIo.Socket): void {
    socket.on('user_read_message', async (obj: UserReadMessage) => {
        const queryParams = {
          query: {'_id' : new ObjectId(obj.chatId)},
          queryField1: 'messages',
          queryField2: 'unread',
          contidition: [obj.userId]
        };
        const result: {_id: string, query: Message[]}[] = await datareader(Chat, queryParams, MongoActions.ARRAY_FILTER);
        const promises = [];
        const chatId = result[0]._id;
        const unreadMes = result[0].query;
        unreadMes.forEach(mes => {
          mes.unread = mes.unread.filter(item => item !== obj.userId);
          promises.push(datareader(Chat, {query: {'_id': new ObjectId(chatId), messages:  {$elemMatch:{_id: new ObjectId(mes._id)}}}, objNew: {$set: {'messages.$.unread': mes.unread}}}, MongoActions.UPDATE_ONE));
        });
        const updateMes = await Promise.all(promises);
      });

}
