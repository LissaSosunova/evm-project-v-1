import { User } from '../../models/user';
import { datareader } from '../../modules/datareader';
import { OnlineClients, DeleteGroupChat, DbQuery } from '../../interfaces/types';
import * as socketIo from 'socket.io';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';
import { ObjectId } from 'mongodb';

export function deleteGroupChat(socket: socketIo.Socket, onlineClients: OnlineClients): void {

    socket.on('delete_group_chat', async (obj: DeleteGroupChat ) => {
        const findChatParams = {
           query: { _id: new ObjectId(obj.chatId)},
           elementMatch: {admin: 1}
        };
        try {
            const chatToDelete: {_id: string, admin: string}[] = await datareader(Chat, findChatParams, MongoActions.FIND_ELEMENT_MATCH);
        if (chatToDelete[0].admin !== obj.admin) {
            return;
        }
        obj.users.forEach(async user => {
            const params: DbQuery = {
                query: {username: user.username},
                objNew:  {$pull: {chats: {chatId: obj.chatId}}}
            };
            await datareader(User, params, MongoActions.UPDATE_ONE);
            if (user.username !== obj.admin) {
                if (onlineClients[user.username]) {
                    Object.keys(onlineClients[user.username]).forEach(token => {
                        onlineClients[user.username][token].emit('delete_group_chat', {chatId: obj.chatId});
                    });
                }
            }
        });
        await datareader(Chat, findChatParams, MongoActions.DELETE_ONE);
        if (onlineClients[obj.admin]) {
            Object.keys(onlineClients[obj.admin]).forEach(token => {
                onlineClients[obj.admin][token].emit('delete_group_chat_response', {chatId: obj.chatId});
            });
        }
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
