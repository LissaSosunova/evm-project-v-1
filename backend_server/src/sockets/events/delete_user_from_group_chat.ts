import { User } from '../../models/user';
import { datareader } from '../../modules/datareader';
import { OnlineClients, DeleteUserFromChatSocketIO, DbQuery } from '../../interfaces/types';
import * as socketIo from 'socket.io';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';
import { ObjectId } from 'mongodb';

export function deleteUserFromGroupChat(socket: socketIo.Socket, onlineClients: OnlineClients): void {
    socket.on('delete_user_from_group_chat', async (obj: DeleteUserFromChatSocketIO) => {
        const deleteUserParams: DbQuery = {
            query: {_id: new ObjectId(obj.chatId), 'users.username': obj.userToDelete},
            objNew: {$set: {'users.$.deleted': true}}
        };
        try {
            await datareader(Chat, deleteUserParams, MongoActions.UPDATE_ONE);
            const deleteChatparams: DbQuery = {
                query: {username: obj.userToDelete, 'chats.chatId': obj.chatId},
                objNew:  {$pull: {chats: {chatId: obj.chatId}}}
            };
            await datareader(User, deleteChatparams, MongoActions.UPDATE_ONE);
            if (onlineClients[obj.userToDelete]) {
                Object.keys(onlineClients[obj.userToDelete]).forEach(token => {
                    onlineClients[obj.userToDelete][token].emit('delete_user_from_group_chat',
                    {chatId: obj.chatId, userToDelete: obj.userToDelete});
                });
            }
            if (onlineClients[obj.admin]) {
                Object.keys(onlineClients[obj.admin]).forEach(token => {
                    onlineClients[obj.admin][token].emit('delete_user_from_group_chat_response',
                    {chatId: obj.chatId, userToDelete: obj.userToDelete});
                });
            }
        } catch (error) {
            console.error('delete_user_from_group_chat', error);
            if (onlineClients[obj.admin]) {
                Object.keys(onlineClients[obj.admin]).forEach(token => {
                  onlineClients[obj.admin][token].emit('error', {event: 'delete_user_from_group_chat', error});
                });
              }
        }
     });
}
