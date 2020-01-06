import { datareader } from '../../modules/datareader';
import * as socketIo from 'socket.io';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';
import { OnlineClients, ClientsInChat, DeleteMessageSocketIO } from '../../interfaces/types';
import { ObjectId } from 'mongodb';

export function deleteMessage(socket: socketIo.Socket, clientsInChat: ClientsInChat, onlineClients: OnlineClients): void {
    socket.on('delete_message', async (obj: DeleteMessageSocketIO) => {
        try {
          if(obj.userId !== obj.authorId) {
            return;
          };
          const deleteMessage = {
            query: {"_id": new ObjectId(obj.chatId)},
            objNew: {$pull: {messages: {_id: new ObjectId(obj.messageId)}}}
          }
          await datareader(Chat, deleteMessage, MongoActions.UPDATE_ONE);
            Object.keys(clientsInChat[obj.chatId]).forEach(userId => {
              Object.keys(clientsInChat[obj.chatId][userId]).forEach(token => {
                  clientsInChat[obj.chatId][userId][token].emit('delete_message',obj);
              });
          });
            obj.unread.forEach(userId => {
              if(onlineClients[userId]) {
                Object.keys(onlineClients[userId]).forEach(token => {
                  onlineClients[userId][token].emit('delete_message_out_of_chat',obj)
                })
              }
            });
          } catch(err) {
            console.error('delete_message', err);
        }
          
      });
}