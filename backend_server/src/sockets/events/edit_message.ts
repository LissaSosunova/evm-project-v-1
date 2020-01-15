import { datareader } from '../../modules/datareader';
import { EditMessageSocketIO, ClientsInChat } from '../../interfaces/types';
import * as socketIo from 'socket.io';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';
import { ObjectId } from 'mongodb';

export function editMessage(socket: socketIo.Socket, clientsInChat: ClientsInChat): void {
    socket.on('edit_message', async (obj: EditMessageSocketIO) => {
        try {
          if (obj.userId !== obj.authorId) {
            return;
          }
          const editMessageQuery = {
            query: {'_id': new ObjectId(obj.chatId), 'messages._id': new ObjectId(obj.messageId)},
            objNew: {$set:  {'messages.$.edited': true, 'messages.$.text': obj.text}}
          };
          await datareader(Chat, editMessageQuery, MongoActions.UPDATE_ONE);
          Object.keys(clientsInChat[obj.chatId]).forEach(userId => {
            Object.keys(clientsInChat[obj.chatId][userId]).forEach(token => {
                clientsInChat[obj.chatId][userId][token].emit('edit_message', obj);
            });
        });
        } catch (error) {
          console.error('edit_message', error);
          if (clientsInChat[obj.chatId] && clientsInChat[obj.chatId][obj.userId]) {
            Object.keys(clientsInChat[obj.userId][obj.userId]).forEach(token => {
              clientsInChat[obj.userId][obj.userId][token].emit('error', {event: 'edit_message', error});
            });
          }
        }

      });
}
