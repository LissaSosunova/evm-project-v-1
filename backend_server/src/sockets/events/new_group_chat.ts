import { datareader } from '../../modules/datareader';
import { OnlineClients, NewGroupChat } from '../../interfaces/types';
import * as socketIo from 'socket.io';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';
import { User } from '../../models/user';

export function newGroupChat(socket: socketIo.Socket, onlineClients: OnlineClients): void {
    socket.on('new_group_chat', async (obj: NewGroupChat) => {
        const chat = new Chat;
        chat.users = obj.users;
        chat.messages = [];
        chat.type = 2;
        chat.chatName = obj.chatName;
        chat.admin = obj.admin;
        await datareader(chat, null, MongoActions.SAVE);
        obj.users.forEach(async user => {
            const chatToSave = {
                name: obj.chatName,
                users: obj.users,
                chatId: chat._id,
                // avatar: '', добавить аватарку чата по умолчанию!!!
                type: 2
            };
            const updateParams = {
                query: user.username,
                objNew:  {$push: {chats: chatToSave}}
            };
            await datareader(User, updateParams, MongoActions.UPDATE_ONE);
            if(onlineClients[user.username]) {
                Object.keys(onlineClients[user.username]).forEach(token => {
                    onlineClients[user.username][token].emit('new_group_chat', chatToSave);
                });
            }
        });
    });
}