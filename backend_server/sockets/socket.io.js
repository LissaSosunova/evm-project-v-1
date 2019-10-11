const Chat = require('../models/chats');
const datareader = require('../modules/datareader');
const User = require('../models/user');
const Event = require('../models/event');
const ObjectId =  require('mongodb').ObjectID;
const ContactData = require('../modules/contactData');
const EventData = require('../modules/eventData');

const onlineClients = {};
const clientsInChat = {};


function runWebsocketsIO(server) {
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
        socket.on("add_user", async obj => {
          /**
           * obj = {
           *  queryUserId: string;
           *  userId: string;
           * }
           */
          if (obj.queryUserId === obj.userId) {
            return
          }
          let exsistCont = false;
          const queryParamDb = {
              username: obj.userId
          };

          try {
            const result = await datareader(User, queryParamDb, 'findOne');
            exsistCont = result.contacts.some(item => {
              return item.id === obj.queryUserId 
           });
            if (exsistCont) {
              return
            }
            const findRes = await datareader(User, {username: obj.queryUserId}, 'findOne');
            findRes.private_chat = '0';
            findRes.status = 3;
            const contact = new ContactData(findRes);
            const updateParams = {
              query: {username: obj.userId},
              objNew:  {$push: {contacts: contact}}
            };
            const updateRes = await datareader(User, updateParams, 'updateOne');
            //добавить найденому другу тоже со статусом ожидания подтверждения с его стороны
            const params2 = {
              $or: [
                {username: contact.id},
                {email: contact.email}
              ]
            };
            const result2 = new ContactData(result);
            result2.private_chat = '0';
            result2.status = 2;
            const addParams = {
              query: params2,
              objNew:  {$push: {contacts: result2}}
            };
            const updateFindedUser = await datareader(User, addParams, 'updateOne');
            if (onlineClients[obj.queryUserId]) {
              Object.keys(onlineClients[obj.queryUserId]).forEach(token => {
                onlineClients[obj.queryUserId][token].emit('add_user_request', result2);
              });
            }
            if(onlineClients[obj.userId]) {
              Object.keys(onlineClients[obj.userId]).forEach(token => {
                onlineClients[obj.userId][token].emit('add_user', contact);
              });
            }
          } catch(error) {
            console.error ('add_user', error);
          }

        });
        socket.on('confirm_user', async obj => {
          /**
           * obj = {
           *  queryUserId: string;
           *  userId: string;
           * }
           */
          if (obj.queryUserId === obj.userId) {
            return
          }
          const params1 = {username: obj.userId};
          const params2 = {username: obj.queryUserId};
          try {
            const response2 = await datareader(User, params2, 'findOne');
            const update2 = {
              query: {"username" : response2.username, "contacts.id": obj.userId},
              objNew: {$set : {"contacts.$.status" : 1 }}
            };
            await datareader(User, update2, 'updateOne' );
            const response1 = await datareader(User, params1, 'findOne');
            const update1 = {
              query: {"username" : response1.username, "contacts.id": obj.queryUserId},
              objNew: {$set : { "contacts.$.status" : 1 }}
            }
            await datareader(User, update1, 'updateOne');
            if (onlineClients[obj.queryUserId]) {
              Object.keys(onlineClients[obj.queryUserId]).forEach(token => {
                onlineClients[obj.queryUserId][token].emit('confirm_user_request', {userId: obj.userId});
              })
            }  
            if(onlineClients[obj.userId]) {
              Object.keys(onlineClients[obj.userId]).forEach(token => {
                onlineClients[obj.userId][token].emit('confirm_user', {userId: obj.queryUserId});
              })
            }
            
          } catch(error) {
            console.error('confirm_user', error);
          }
        });
        socket.on("delete_request", async obj => {
          /**
           * obj = {
           *  queryUserId: string;
           *  userId: string;
           * }
           */
          const queryParamDb = {
            query: {username: obj.userId},
            objNew: {$pull: {contacts: {id: obj.queryUserId}}}
          };
          const queryDb = {
            query: {username: obj.queryUserId},
            objNew: {$pull: {contacts: {id: obj.userId}}}
          }
          try {
            await datareader(User, queryParamDb, 'updateOne');
            await datareader(User, queryDb, 'updateOne');
            if (onlineClients[obj.queryUserId]) {
              Object.keys(onlineClients[obj.queryUserId]).forEach(token => {
                onlineClients[obj.queryUserId][token].emit('reject_request', {userId: obj.userId});
              });  
            }
            if(onlineClients[obj.userId]) {
              Object.keys(onlineClients[obj.userId]).forEach(token => {
                onlineClients[obj.userId][token].emit('delete_request', {userId: obj.queryUserId});
              });
            }
          } catch (error) {
            console.error('confirm_user', error);
          }

        });

        // socket.on("reject_request", async obj => {
        //   /**
        //    * obj = {
        //    *  queryUserId: string;
        //    *  userId: string;
        //    * }
        //    */
        //   const queryParamDb = {
        //     query: {username: obj.userId},
        //     objNew: {$pull: {contacts: {id: obj.queryUserId}}}
        //   };
        //   const queryDb = {
        //     query: {username: obj.queryUserId},
        //     objNew: {$pull: {contacts: {id: obj.userId}}}
        //   }
        //   try {
        //     await datareader(User, queryParamDb, 'updateOne');
        //     await datareader(User, queryDb, 'updateOne');
        //     if (onlineClients[obj.queryUserId]) {
        //       Object.keys(onlineClients[obj.queryUserId]).forEach(token => {
        //         onlineClients[obj.queryUserId][token].emit('delete_request', {userId: obj.userId});
        //       });  
        //     }
        //     if(onlineClients[obj.userId]) {
        //       Object.keys(onlineClients[obj.userId]).forEach(token => {
        //         onlineClients[obj.userId][token].emit('reject_request', {userId: obj.queryUserId});
        //       });
        //     }
        //   } catch (error) {
        //     console.error('confirm_user', error);
        //   }

        // });

        socket.on("delete_contact", async obj => {
          /**
           * obj = {
           *  userId: string;
           *  deleteContactId: string;
           *  chatIdToDelete: string;
           *  deleteChat: boolean
           * }
           */

          const deleteContactInMyList = {
            query: {username: obj.userId},
            objNew: {$pull: {contacts: {id: obj.deleteContactId}}}
          };
          const deleteContactInOtherList = {
            query: {username: obj.deleteContactId},
            objNew: {$pull: {contacts: {id: obj.userId}}}
          };
          
          const deleteChat = {
            query: {$and: [{'users.username': obj.userId}, {'users.username': obj.deleteContactId}]},
            objNew: {$set:{type: 4}}
          };
          try {
            await datareader(User, deleteContactInMyList, 'updateOne');
            await datareader(User, deleteContactInOtherList, 'updateOne');
            
            if (obj.deleteChat) {
              const deleteChatInMyContact = {
                query: {username: obj.userId, "chats.id": obj.deleteContactId},
                objNew: {$pull: {chats: {chatId: obj.chatIdToDelete}}}
              };
              const deleteChatInOtherList = {
                query: {username: obj.deleteContactId, "chats.id": obj.userId},
                objNew: {$pull: {chats: {chatId: obj.chatIdToDelete}}}
              };
              await datareader(Chat, {$and: [{'users.username': obj.userId}, {'users.username': obj.deleteContactId}]}, 'deleteOne');
              await datareader(User, deleteChatInMyContact, 'updateOne');
              await datareader(User, deleteChatInOtherList, 'updateOne');
            } else {
              const deleteChatInMyContact = {
                query: {username: obj.userId, "chats.id": obj.deleteContactId},
                objNew: {$set: {"chats.$.type": 4}}
              };
              const deleteChatInOtherList = {
                query: {username: obj.deleteContactId, "chats.id": obj.userId},
                objNew: {$set: {"chats.$.type": 4}}
              };
              await datareader(User, deleteChatInMyContact, 'updateOne');
              await datareader(User, deleteChatInOtherList, 'updateOne');
              await datareader(Chat, deleteChat, 'updateOne');
            }
            if (onlineClients[obj.deleteContactId]) {
              Object.keys(onlineClients[obj.deleteContactId]).forEach(token => {
                onlineClients[obj.deleteContactId][token].emit('delete_contact', {userId: obj.userId, chatId: obj.chatIdToDelete});
              });  
            }
            if(onlineClients[obj.userId]) {
              Object.keys(onlineClients[obj.userId]).forEach(token => {
                onlineClients[obj.userId][token].emit('delete_contact', {userId: obj.deleteContactId,  chatId: obj.chatIdToDelete});
              });
            }
          } catch (error) {
            console.error('delete_contact', error);
          }
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
        });

        socket.on("new_event", async obj => {
          /**
           * obj = {
           *  _id?: string;
              name: string;
              status: boolean;
              date_type: string;
              date: EventDateDb;
              place: eventPlace;
              members: eventMembers;
              additional: string;
              notification?: eventNotification;
              authorId: string;
           * }
            EventDateDb {
              startDate: number;
              endDate?: number;
            }
            eventPlace {
              location: string
            }
            eventMembers {
              invited: string[];
            }
            eventNotification {
              type: string;
              message: string;
              id: string;
              status: boolean
            }
           */
          const event = new Event;
          event.name = obj.name;
          event.status = obj.status;
          event.date_type = obj.date_type;
          event.date = obj.date;
          event.place = obj.place;
          event.members = obj.members;
          event.additional = obj.additional;
          event.notification = { type: 'event', message: 'You are invited to new event', id: '', status: true};
          try {
            await datareader(event, null, 'save'); 
            const createdEvent = new EventData(event);
            const response = await datareader(User, {username:  obj.authorId}, 'findOne');
            const updateParams = {
              query: {username: response.username},
              objNew: {$push: {events:createdEvent}}
            };
            await datareader(User, updateParams, 'updateOne');
            if(event.members && event.members.invited && event.members.invited.length !== 0){
              event.notification.id = event._id;
              event.members.invited.forEach(async item => {
                const update = {
                  query: {username: item},
                  objNew: {$push: {events:createdEvent}}
                };
                await datareader(User, update, 'updateOne');
                if(event.status){
                  const updateNotifications = {
                    query: {username: item},
                    objNew: {$push: {notifications:event.notification}}
                  };
                  await datareader(User, updateNotifications, 'updateOne');
                }
              });
            }
            if (onlineClients[obj.authorId]) {
              Object.keys(onlineClients[obj.authorId]).forEach(token => {
                onlineClients[obj.authorId][token].emit("new_event_confirm", { message: "Saved", eventId: createdEvent.id})
              });
            }
            obj.members.invited.forEach(userId => {
              if (onlineClients[userId]) {
                Object.keys(onlineClients[userId]).forEach(token => {
                  onlineClients[userId][token].emit("new_event", obj);
                });
              }
            })
          } catch(err) {
            console.error('new event', err)
          }
          ;
        });

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
