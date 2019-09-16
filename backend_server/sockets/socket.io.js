const Chat = require('../models/chats');
const datareader = require('../modules/datareader');
const User = require('../models/user');
const ObjectId =  require('mongodb').ObjectID;

const onlineClients = {};
const clientsInChat = {};


function runWebsocketsIO(server, expressApp) {
    const io = require('socket.io').listen(server);
    console.info('Socket IO is running');



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
              socket.userId = obj.userId;
              socket.token = obj.token;
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
             try {
                delete onlineClients[obj.userId][obj.token];
                if (Object.keys(onlineClients[obj.userId].length === 0)) {
                  delete onlineClients[obj.userId];
                }
                socket.broadcast.emit("user_left", {userId: obj.userId});
             } catch (err) {
               console.error('user_left', err);
             }
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
            socket.userId = obj.userId;
            socket.token = obj.token;
            socket.chatIdCurr = obj.chatIdCurr;
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
            try {
              delete clientsInChat[obj.chatIdCurr][obj.userId][obj.token];
              if (Object.keys(clientsInChat[obj.chatIdCurr][obj.userId]).length === 0) {
                  delete clientsInChat[obj.chatIdCurr][obj.userId];
              }
              if (Object.keys(clientsInChat[obj.chatIdCurr]).length === 0) {
                  delete clientsInChat[obj.chatIdCurr]
              }
            } catch (err) {
              console.error("user_left_chat", err);
            }
            
        });

        socket.on("user_is_typing", obj => {
          /**
           obj = {
          userId: string;
          name: string;
          users: string[];
          chatId: string;
          typing: boolean
          }
           */

          if(clientsInChat[obj.chatId]) {
            Object.keys(clientsInChat[obj.chatId]).forEach(userId => {
              Object.keys(clientsInChat[obj.chatId][userId]).forEach(token => {
                if (obj.userId !== userId) {
                  clientsInChat[obj.chatId][userId][token].emit('user_is_typing', obj);
                }
              })
            })
          }
        });

        socket.on('delete_message', async obj => {
          /**
           * obj = {
           * userId: string,
           * authorId: string
           * messageId: string,
           * chatId: string,
           * unread: string[]
           * }
           */
          try {
            if(obj.userId !== obj.authorId) {
              return;
            };
            const deleteMessage = {
              query: {"_id": ObjectId(obj.chatId)},
              objNew: {$pull: {messages: {_id: ObjectId(obj.messageId)}}}
            }
            await datareader(Chat, deleteMessage, 'updateOne');
              Object.keys(clientsInChat[obj.chatId]).forEach(userId => {
                Object.keys(clientsInChat[obj.chatId][userId]).forEach(token => {
                    clientsInChat[obj.chatId][userId][token].emit('delete_message',obj);
                });
            });
              obj.unread.forEach(userId => {
                if(onlineClients[userId]) {
                  Object.keys(onlineClients[userId]).forEach(token => {
                    onlineClients[userId][token].emit('delete_message_out_of_chat',obj)
                  })
                }
              });
            } catch(err) {
              console.error('delete_message', err);
          }
            
        });

        socket.on('edit_message', async obj => {
          /**
           * obj = {
           *  text: string,
           *  userId: string,
              chatId: string,
              messageId: string,
              authorId: string
           * }
           */
          try {
            if(obj.userId !== obj.authorId) {
              return;
            };
            const editMessage = {
              query: {"_id": ObjectId(obj.chatId), "messages._id": ObjectId(obj.messageId)},
              objNew: {$set:  {'messages.$.edited': true, 'messages.$.text': obj.text}}
            };
            await datareader(Chat, editMessage, 'updateOne');
            Object.keys(clientsInChat[obj.chatId]).forEach(userId => {
              Object.keys(clientsInChat[obj.chatId][userId]).forEach(token => {
                  clientsInChat[obj.chatId][userId][token].emit('edit_message',obj);
              });
          })
          } catch(err) {
            console.error('edit_message', err);
          }

        });

        socket.on('user_read_message', async obj => {
          /**
           obj = {
          userId: string;
          chatId: string;
          }
           */

          const queryParams = {
            query: {"_id" : ObjectId(obj.chatId)},
            queryField1: 'messages',
            queryField2: 'unread',
            contidition: [obj.userId]
          };
          const result = await datareader(Chat, queryParams, 'arrayFilter');
          const promises = [];
          const chatId = result[0]._id;
          const unreadMes = result[0].query;
          unreadMes.forEach(mes => {
            mes.unread = mes.unread.filter(item => item !== obj.userId);
            promises.push(datareader(Chat, {query: {"_id": ObjectId(chatId), messages:  {$elemMatch:{_id: ObjectId(mes._id)}}}, objNew: {$set: {'messages.$.unread': mes.unread}}}, 'updateOne'));
          });
          const updateMes = await Promise.all(promises);
        })

        socket.on("disconnect", obj => {
          console.info(`User ${socket.userId} is offline`);
          try {
            if (onlineClients[socket.userId] && onlineClients[socket.userId][socket.token]) {
              delete onlineClients[socket.userId][socket.token];
            }
            if (onlineClients[socket.userId] && Object.keys(onlineClients[socket.userId]).length === 0) {
              delete onlineClients[socket.userId];
            }
            if (socket.chatIdCurr && clientsInChat[socket.chatIdCurr]) {
              delete clientsInChat[socket.chatIdCurr][socket.userId][socket.token];
            }
            if (clientsInChat[socket.chatIdCurr] && 
              clientsInChat[socket.chatIdCurr][socket.userId] &&
              Object.keys(clientsInChat[socket.chatIdCurr][socket.userId]).length === 0) {
                delete clientsInChat[socket.chatIdCurr][socket.userId];
            } 
          } catch(err) {
            console.error('disconnect', err);
          }
        
        });

    });

}

module.exports = runWebsocketsIO;
