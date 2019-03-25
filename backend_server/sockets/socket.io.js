const Chat = require('../models/chats');
const datareader = require('../modules/datareader');
const User = require('../models/user');

function loadSession(sid, callback) {
    sessionStore.load(sid, function (err, session) {
        if (arguments.length == 0) {
            //no arguments => no session
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    });
}

function loadUser(session, callback) {
    if (!session.user) {
        return callback(null, null);
    }

    User.findById(session.user, function (err, user) {
        if (err) return callback(err);

        if (!user) {
            return callback(null, null);
        }

        callback(null, user);
    })
}


function runWebsocketsIO(server, expressApp) {
    const io = require('socket.io').listen(server);
    expressApp.set('io', io);
    // io.set('origins', 'localhost:*');
    console.info('socket.io is running');
    // данный код не даёт подключится к сокетам неавторизированным пользователям
    // io.use(function (socket, next) {
    //     const handshakeData = socket.request;
        //console.info('socket', socket);

        // async.waterfall([
        //     function (callback) {
        //         //получить sid
        //         const parser = cookieParser(secret);
        //         parser(handshakeData, {}, function (err) {
        //             if (err) return callback(err);

        //             var sid = handshakeData.signedCookies[sessionKey];

        //             loadSession(sid, callback);
        //         });
        //     },
        //     function (session, callback) {
        //         if (!session) {
        //             return callback(new HttpError(401, "No session"));
        //         }

        //         socket.handshake.session = session;
        //         loadUser(session, callback);
        //     },
        //     function (user, callback) {
        //         if (!user) {
        //             return callback(new HttpError(403, "Anonymous session may not connect"));
        //         }
        //         callback(null, user);
        //     }
        // ], function (err, user) {

        //     if (err) {
        //         if (err instanceof HttpError) {
        //             return next(new Error('not authorized'));
        //         }
        //         next(err);
        //     }

        //     socket.handshake.user = user;
        //     next();

        // });

   // });

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
              console.log(onlineClients);
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
            console.log("user_left", onlineClients);
        });

        socket.on("message", obj => {
            /*
            obj = {
                chatID: string;
                authorId: string;
                text: string;
                isSelected: boolean;
                edited: boolean;
                unread: string[];
                users: string[]
                date: number; // timeStamp (to UTC)
            }
             */

            
            if (clientsInChat[obj.chatIdCurr]) {
                // Находим пользователей, которые не в чате
                Object.keys(clientsInChat[obj.chatIdCurr]).forEach(userId => {
                    const userInChat = obj.users.find(item => {
                        return item === userId;
                    });
                    if (!userInChat) {
                        obj.unread.push(userId);
                    }
                });
            }    
            if (clientsInChat[obj.chatIdCurr]) {
                // Шлём сообщения всем, кто в чате
                Object.keys(clientsInChat[obj.chatIdCurr]).forEach(userId => {
                    Object.keys(clientsInChat[obj.chatIdCurr][obj.userId]).forEach(token => {
                        clientsInChat[obj.chatIdCurr][userId][token].emit('new_message',obj); // попробовать вместо send emit
                    });
                });
            }
            
            const updateParams = {
                query: {_id: obj.chatID},
                objNew: {$push: {messages: {$each: [obj], $position: 0}}}
            };
            datareader(Chat, updateParams, 'updateOne') // Сохраняем в базу данных сообщение, причём записываем его в начало массива
            .then(res => {
              console.log('chats update', res);
            // Шлём всем кто в онлайн обновленную модель списка чатов 
              obj.users.forEach(user => {
                Object.keys(onlineClients).forEach(async onlineUser => {
                    if(user === onlineUser) {
                        try {
                            const queryParams = {
                                query: user,
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
                                                unread: userDb.username
                                                }
                                            }
                                        }
                                    };
                                    promises.push(datareader(Chat, queryParams, 'findElementMatch'));
                                }
                            });
                            const unreadMes = await Promise.all(promises);
                            console.log('unreadMes', unreadMes);
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
                            Object.keys(onlineUser).forEach(token => {
                                token.emit('chats_model', chatList);
                            });
                        } catch(err) {
                            console.error(new Error(err));
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
                chatIdPrev: string;
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
            delete clientsInChat[obj.chatIdPrev][obj.userId][obj.token];
            if (Object.keys(clientsInChat[obj.chatIdPrev][obj.userId]).length === 0) {
                delete clientsInChat[obj.chatIdPrev][obj.userId];
            }
            if (Object.keys(clientsInChat[obj.chatIdPrev]).length === 0) {
                delete clientsInChat[obj.chatIdPrev]
            }
        });

        socket.on("user_left_chat", obj => {
            /*
            obj = {
                chatIdPrev: string;
                userId: string;
                token: string
            }
             */
            delete clientsInChat[obj.chatIdPrev][obj.userId][obj.token];
            if (Object.keys(clientsInChat[obj.chatIdPrev][obj.userId]).length === 0) {
                delete clientsInChat[obj.chatIdPrev][obj.userId];
            }
            if (Object.keys(clientsInChat[obj.chatIdPrev]).length === 0) {
                delete clientsInChat[obj.chatIdPrev]
            }
        });

        io.on("disconnect", () => {
            console.log("disconnect");
            delete onlineClients[obj.userId][obj.token]
        });
    });

   
}

module.exports = runWebsocketsIO;