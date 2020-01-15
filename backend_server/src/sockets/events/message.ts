import { datareader } from '../../modules/datareader';
import { ClientsInChat, OnlineClients, Message } from '../../interfaces/types';
import * as socketIo from 'socket.io';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';

export function message (socket: socketIo.Socket, onlineClients: OnlineClients, clientsInChat: ClientsInChat): void {
    socket.on('message', (obj: Message) => {
        obj.unread = obj.unread || [];
        if (clientsInChat[obj.chatID]) {
            // Находим пользователей, которые не в чате
            obj.users.forEach(userId => {
                const userOffChat = Object.keys(clientsInChat[obj.chatID]).every(item => {
                    return item !== userId.username;
                });
                if (userOffChat) {
                    obj.unread.push(userId.username);
                }
            });
        }

        const updateParams = {
            query: {_id: obj.chatID},
            objNew: {$push: {messages: {$each: [obj], $position: 0}}}
        };
        datareader(Chat, updateParams, MongoActions.UPDATE_ONE) // Сохраняем в базу данных сообщение, причём записываем его в начало массива
        .then(async res => {
             // Шлём сообщения всем, кто в чате
             const getSavedMess = {
                query: {_id: obj.chatID},
                elementMatch: {messages: {$slice: [0, 1]}}
             };
            const savedMessageResponse = await datareader(Chat, getSavedMess, MongoActions.FIND_ONE_ELEMENT_MATCH);
            obj._id = savedMessageResponse.messages[0]._id;
            Object.keys(clientsInChat[obj.chatID]).forEach(userId => {
                Object.keys(clientsInChat[obj.chatID][userId]).forEach(token => {
                    clientsInChat[obj.chatID][userId][token].emit('new_message', obj);
                });
            });
            // шлем всем кто онлайн сообщение для обновления модели
            obj.users.forEach(user => {
              Object.keys(onlineClients).forEach(userId => {
                if (user.username === userId) {
                  Object.keys(onlineClients[userId]).forEach(token => {
                    onlineClients[userId][token].emit('chats_model', obj);
                  });
                }
              });
              // шлем всем кто онлайн, но не в чате сообщение
              const userIdsOutOfChat = Object.keys(onlineClients).filter(userId => {
                return Object.keys(clientsInChat[obj.chatID]).every(userIdInChat => userIdInChat !== userId);
              });
              userIdsOutOfChat.forEach(userId => {
                if (user.username === userId) {
                  Object.keys(onlineClients[userId]).forEach(token => {
                    onlineClients[userId][token].emit('message_out_of_chat', obj);
                  });
                }
              });
            });
        });
    });
}
