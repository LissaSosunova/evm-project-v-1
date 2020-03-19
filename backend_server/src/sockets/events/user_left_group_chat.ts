import { OnlineClients, UserLeftChat, DbQuery, UsersInChatDb, ClientsInChat } from '../../interfaces/types';
import * as socketIo from 'socket.io';
import { ObjectId } from 'mongodb';
import { datareader } from '../../modules/datareader';
import { Chat } from '../../models/chats';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';

export function userLeftGroupChat(socket: socketIo.Socket, onlineClients: OnlineClients, clientsInChat: ClientsInChat): void {

    socket.on('user_left_group_chat', async (obj: UserLeftChat) => {
        const deleteChatParams: DbQuery = {
            query: {_id: new ObjectId(obj.chatId), 'users.username': obj.userId},
            objNew: {$set: {'users.$.deleted': true}}
        };
        const deleteUserParams: DbQuery = {
            query: {username: obj.userId, 'chats.chatId': obj.chatId},
            objNew:  {$pull: {chats: {chatId: obj.chatId}}}
        };
        try {
            await datareader(Chat, deleteChatParams, MongoActions.UPDATE_ONE);
            await datareader(User, deleteUserParams, MongoActions.UPDATE_ONE);
            const findChatParams = {
                query: { _id: new ObjectId(obj.chatId)},
                elementMatch: {users: 1}
            };
            const chat: {_id: string, users: UsersInChatDb[]}[] = await datareader(Chat, findChatParams, MongoActions.FIND_ELEMENT_MATCH);
            const users: string[] = chat[0].users.map(u => {
                return u.username;
            });
            users.forEach(u => {
                if (onlineClients[u] && u === obj.userId) {
                    Object.keys(onlineClients[obj.userId]).forEach(token => {
                        onlineClients[obj.userId][token].emit('user_left_group_chat_response', obj);
                    });
                } else if (clientsInChat[obj.chatId] && clientsInChat[obj.chatId][u] && u !== obj.userId) {
                    Object.keys(clientsInChat[obj.chatId]).forEach(userId => {
                        Object.keys(clientsInChat[obj.chatId][userId]).forEach(token => {
                            if (userId !== obj.userId) {
                                clientsInChat[obj.chatId][userId][token].emit('user_left_group_chat', obj);
                            }
                        });
                    });
                }
            });
        } catch (error) {
            console.error('user_left_group_chat', error);
            if (onlineClients[obj.userId]) {
                Object.keys(onlineClients[obj.userId]).forEach(token => {
                    onlineClients[obj.userId][token].emit('error', {event: 'user_left_group_chat', error});
                });
            }
        }
    });
}
