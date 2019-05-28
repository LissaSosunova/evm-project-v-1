const Chat = require('../models/chats');
const datareader = require('../modules/datareader');
const User = require('../models/user');


function runWebsocketsIO(server, expressApp) {
    const io = require('socket.io').listen(server);
    console.info('Socket IO is running');

    const onlineClients = {};
    const clientsInChat = {};

    /*
    onlineClients = {
        [userId: string]: {
            [token: string]: string
        }
    }

    clientsInChat = {
        [chatId: string]: {
            [userId: string]: {
                [token: string]: string
            }
        }
    }
    */

    io.on("connection", socket => {
        console.info('new connection');
         const handshake = socket.handshake;
        // console.log('handshake', handshake);
        //  const clientId = handshake.headers['x-clientid'];
        //  const token = handshake.headers['x-token'];
        socket.on("user", obj => {
            /**
            obj = {
               userId: string;
               token: string;
            }
             */
            if (!onlineClients[obj.userId]) {
                onlineClients[obj.userId] = {};
              }
              onlineClients[obj.userId][obj.token] = socket;
              socket.emit("all_online_users", Object.keys(onlineClients));
              socket.broadcast.emit("user", {userId: obj.userId});
        });
        socket.on("user_left", obj => {
            /**
            obj = {
               userId: string;
               token: string;
            }
             */
            delete onlineClients[obj.userId][obj.token];
            socket.broadcast.emit("user_left", {userId: obj.userId});
        });

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
                Object.keys(clientsInChat[obj.chatID]).forEach(userId => {
                    const userInChat = obj.users.find(item => {
                        return item === userId;
                    });
                    if (!userInChat) {
                        obj.unread.push(userId);
                    }
                });
              
            }

            const updateParams = {
                query: {_id: obj.chatID},
                objNew: {$push: {messages: {$each: [obj], $position: 0}}}
            };
            datareader(Chat, updateParams, 'updateOne') // Сохраняем в базу данных сообщение, причём записываем его в начало массива
            .then(res => {
                 // Шлём сообщения всем, кто в чате
                Object.keys(clientsInChat[obj.chatID]).forEach(userId => {
                    Object.keys(clientsInChat[obj.chatID][userId]).forEach(token => {
                        clientsInChat[obj.chatID][userId][token].emit('new_message',obj); // попробовать вместо send emit
                    });
                });
            // Шлём всем кто в онлайн обновленную модель списка чатов
              obj.users.forEach(user => {
                Object.keys(onlineClients).forEach(async onlineUser => {
                    if(user === onlineUser) {
                        try {
                            const queryParams = {
                                query: {username: user},
                                elementMatch: {chats: 1}
                              };  
                            const chatList = await datareader(User, queryParams, 'findElementMatch');
                            const promises = [];
                            chatList.forEach(chat => {
                                if(chat.chatId) {
                                    const queryParams = {
                                    query: {_id: chat.chatId},
                                    elementMatch: {
                                        messages:{
                                            $elemMatch:{
                                                unread: chatList.chats.username
                                                }
                                            }
                                        }
                                    };
                                    promises.push(datareader(Chat, queryParams, 'findElementMatch'));
                                }
                            });
                            const unreadMes = await Promise.all(promises);
                            const unreadNumInChats = [];
                            unreadMes.forEach(item => {
                            const obj = {};
                            obj.chatId = String(item[0]._id);
                            obj.unreadMes = item[0].messages.length;
                            if (item[0].messages.length > 0) {
                                obj.lastMessage = item[0].messages[0];
                            }
                            unreadNumInChats.push(obj);
                            });
                            chatList.forEach(item => {
                                unreadNumInChats.forEach(el => {
                                    if (item.chatId && item.chatId === el.chatId) {
                                        item.unreadMes = el.unreadMes;
                                        item.lastMessage = el.lastMessage;
                                    }
                                })
                            });
                            Object.keys(onlineClients).forEach(userId => {
                                Object.keys(onlineClients[userId]).forEach(token => {
                                    onlineClients[userId][token].emit('chats_model', chatList);
                                });
                            });
                        } catch(err) {
                            console.error('message event error', new Error(err));
                        }

                        }
                    })

                })
            })
        })

        socket.on("user_in_chat", obj => {
            /*
            obj = {
                chatIdCurr: string;
                userId: string;
                token: string
            }
             */
            if (!clientsInChat[obj.chatIdCurr]) {
                clientsInChat[obj.chatIdCurr] = {}
            }
            if (!clientsInChat[obj.chatIdCurr][obj.userId]) {
                clientsInChat[obj.chatIdCurr][obj.userId] = {}
            }
            clientsInChat[obj.chatIdCurr][obj.userId][obj.token] = socket;
        });

        socket.on("user_left_chat", obj => {
            /*
            obj = {
                chatId: string;
                userId: string;
                token: string
            }
             */
            delete clientsInChat[obj.chatIdCurr][obj.userId][obj.token];
            if (Object.keys(clientsInChat[obj.chatIdCurr][obj.userId]).length === 0) {
                delete clientsInChat[obj.chatIdCurr][obj.userId];
            }
            if (Object.keys(clientsInChat[obj.chatIdCurr]).length === 0) {
                delete clientsInChat[obj.chatIdCurr]
            }
        });

        io.on("disconnect", () => {
            console.log(`User ${obj.userId} is offline`);
            delete onlineClients[obj.userId][obj.token]
        });
    });


}

module.exports = runWebsocketsIO;
