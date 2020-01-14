import { User } from '../../models/user';
import { datareader } from '../../modules/datareader';
import { OnlineClients, DeleteGroupChat } from '../../interfaces/types';
import * as socketIo from 'socket.io';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';
import { ObjectId } from 'mongodb';

export function deleteGroupChat(socket: socketIo.Socket, onlineClients: OnlineClients): void {

    socket.on('delete_group_chat', async (obj: DeleteGroupChat ) => {
        const findChatParams = {
            _id: new ObjectId(obj.chatId),
        };
        try {
            const chatToDelete = await datareader(Chat, findChatParams, MongoActions.FIND_ONE);
        if (chatToDelete.admin !== obj.admin) {
            return;
        }
        await datareader(Chat, findChatParams, MongoActions.DELETE_ONE);
        obj.users.forEach(async user => {
            const params = {
                query: user.username,
                objNew:  {$pull: {chats: {chatId: obj.chatId}}}
            };
            await datareader(User, params, MongoActions.UPDATE_ONE);
            if (onlineClients[user.username]) {
                Object.keys(onlineClients[user.username]).forEach(token => {
                    onlineClients[user.username][token].emit('delete_group_chat', {chatId: obj.chatId});
                });
            }
        });
        } catch (error) {
           console.error('delete_group_chat', error);
          if (onlineClients[obj.admin]) {
            Object.keys(onlineClients[obj.admin]).forEach(token => {
              onlineClients[obj.admin][token].emit('error', {event: 'delete_group_chat', error});
            });
          }
        }
     });
}
