import { datareader } from '../../modules/datareader';
import { EditMessageSocketIO, ClientsInChat } from '../../interfaces/types';
import * as socketIo from 'socket.io';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';
import { ObjectId } from 'mongodb';

export function editMessage(socket: socketIo.Socket, clientsInChat: ClientsInChat): void {
    socket.on('edit_message', async (obj: EditMessageSocketIO) => {
        try {
          if(obj.userId !== obj.authorId) {
            return;
          };
          const editMessage = {
            query: {"_id": new ObjectId(obj.chatId), "messages._id": new ObjectId(obj.messageId)},
            objNew: {$set:  {'messages.$.edited': true, 'messages.$.text': obj.text}}
          };
          await datareader(Chat, editMessage, MongoActions.UPDATE_ONE);
          Object.keys(clientsInChat[obj.chatId]).forEach(userId => {
            Object.keys(clientsInChat[obj.chatId][userId]).forEach(token => {
                clientsInChat[obj.chatId][userId][token].emit('edit_message',obj);
            });
        })
        } catch(err) {
          console.error('edit_message', err);
        }

      });
}