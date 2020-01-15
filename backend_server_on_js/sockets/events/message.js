const Chat = require('../../models/chats');
const datareader = require('../../modules/datareader');

function message (socket, clientsInChat) {
    socket.on("message", obj => {
        /*
        obj = {
            chatID: string;
            authorId: string;
            text: string;
            edited: boolean;
            unread: string[];
            users: string[]
            date: number; // timeStamp (to UTC)
        }
         */
        obj.unread = obj.unread || [];
        if (clientsInChat[obj.chatID]) {
            // Находим пользователей, которые не в чате
            obj.users.forEach(userId => {
                const userOffChat = Object.keys(clientsInChat[obj.chatID]).every(item => {
                    return item !== userId.username
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
        datareader(Chat, updateParams, 'updateOne') // Сохраняем в базу данных сообщение, причём записываем его в начало массива
        .then(async res => {
             // Шлём сообщения всем, кто в чате
             const getSavedMess = {
                query: {_id: obj.chatID},
                elementMatch: {messages: {$slice: [0, 1]}}
             };
            const savedMessageResponse = await datareader(Chat, getSavedMess, 'findOneElementMatch');
            obj._id = savedMessageResponse.messages[0]._id;
            Object.keys(clientsInChat[obj.chatID]).forEach(userId => {
                Object.keys(clientsInChat[obj.chatID][userId]).forEach(token => {
                    clientsInChat[obj.chatID][userId][token].emit('new_message',obj);
                });
            });
            // шлем всем кто онлайн сообщение для обновления модели
            obj.users.forEach(user => {
              Object.keys(onlineClients).forEach(userId => {
                if(user.username === userId) {
                  Object.keys(onlineClients[userId]).forEach(token => {
                    onlineClients[userId][token].emit('chats_model',obj)
                  })
                }
              });
              // шлем всем кто онлайн, но не в чате сообщение
              const userIdsOutOfChat = Object.keys(onlineClients).filter(userId => {
                return Object.keys(clientsInChat[obj.chatID]).every(userIdInChat => userIdInChat !== userId)
              });
              userIdsOutOfChat.forEach(userId => {
                if(user.username === userId) {
                  Object.keys(onlineClients[userId]).forEach(token => {
                    onlineClients[userId][token].emit('message_out_of_chat', obj);
                  })
                }
              })
            })
        })
    });
}

module.exports = message;