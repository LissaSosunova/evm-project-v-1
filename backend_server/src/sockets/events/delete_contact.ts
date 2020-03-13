import { User } from '../../models/user';
import { datareader } from '../../modules/datareader';
import { OnlineClients, DeleteContactSocketIo, ChatType, DbQuery } from '../../interfaces/types';
import * as socketIo from 'socket.io';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';
import { ObjectId } from 'mongodb';

export function deleteContact(socket: socketIo.Socket, onlineClients: OnlineClients): void {
    socket.on('delete_contact', async (obj: DeleteContactSocketIo) => {
        const deleteContactInMyList: DbQuery = {
          query: {username: obj.userId},
          objNew: {$pull: {contacts: {id: obj.deleteContactId}}}
        };
        const deleteContactInOtherList: DbQuery = {
          query: {username: obj.deleteContactId},
          objNew: {$pull: {contacts: {id: obj.userId}}}
        };
        const deleteChat: DbQuery = {
          query: {$and: [{'users.username': obj.userId}, {'users.username': obj.deleteContactId}]},
          objNew: {$set: {type: ChatType.DELETED_CHAT}}
        };
        try {
          await datareader(User, deleteContactInMyList, MongoActions.UPDATE_ONE);
          await datareader(User, deleteContactInOtherList, MongoActions.UPDATE_ONE);
          if (obj.deleteChat) {
            const deleteChatInMyContact: DbQuery = {
              query: {username: obj.userId, 'chats.id': obj.deleteContactId},
              objNew: {$pull: {chats: {chatId: obj.chatIdToDelete}}}
            };
            const deleteChatInOtherList: DbQuery = {
              query: {username: obj.deleteContactId, 'chats.id': obj.userId},
              objNew: {$pull: {chats: {chatId: obj.chatIdToDelete}}}
            };
            await datareader(Chat, { _id: new ObjectId(obj.chatIdToDelete)}, MongoActions.DELETE_ONE);
            await datareader(User, deleteChatInMyContact, MongoActions.UPDATE_ONE);
            await datareader(User, deleteChatInOtherList, MongoActions.UPDATE_ONE);
          } else {
            const deleteChatInMyContact: DbQuery = {
              query: {username: obj.userId, 'chats.id': obj.deleteContactId},
              objNew: {$set: {'chats.$.type': ChatType.DELETED_CHAT}}
            };
            const deleteChatInOtherList: DbQuery = {
              query: {username: obj.deleteContactId, 'chats.id': obj.userId},
              objNew: {$set: {'chats.$.type': ChatType.DELETED_CHAT}}
            };
            await datareader(User, deleteChatInMyContact, MongoActions.UPDATE_ONE);
            await datareader(User, deleteChatInOtherList, MongoActions.UPDATE_ONE);
            await datareader(Chat, deleteChat, MongoActions.UPDATE_ONE);
          }
          if (onlineClients[obj.deleteContactId]) {
            Object.keys(onlineClients[obj.deleteContactId]).forEach(token => {
              onlineClients[obj.deleteContactId][token].emit('delete_contact', {userId: obj.userId, chatId: obj.chatIdToDelete});
            });
          }
          if (onlineClients[obj.userId]) {
            Object.keys(onlineClients[obj.userId]).forEach(token => {
              onlineClients[obj.userId][token].emit('delete_contact', {userId: obj.deleteContactId,  chatId: obj.chatIdToDelete});
            });
          }
        } catch (error) {
          console.error('delete_contact', error);
          if (onlineClients[obj.userId]) {
            Object.keys(onlineClients[obj.userId]).forEach(token => {
              onlineClients[obj.userId][token].emit('error', {event: 'delete_contact', error});
            });
          }
        }
      });
}
