const newGroupChat = require('./events/new_group_chat');
const userIsTyping = require('./events/user_is typing');
const addUser = require('./events/add_user');
const confirmUser = require('./events/confirm_user');
const deleteRequest = require('./events/delete_request');
const deleteConact = require('./events/delete_contact');
const message = require('./events/message');
const deleteMessage = require('./events/delete_message');
const editMessage = require('./events/edit_message');
const userReadMessage = require('./events/user_read_message');
const newEvent = require('./events/new_event');
const deleteGroupChat = require('./events/delete_group_chat');
const deleteUserFromGroupChat = require('./events/delete_user_from_group_chat');

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

        addUser(socket, onlineClients);
        confirmUser(socket, onlineClients);
        deleteRequest(socket, onlineClients);
        deleteConact(socket, onlineClients);
        message(socket, clientsInChat);
        userIsTyping(socket, clientsInChat);
        deleteMessage(socket,clientsInChat, onlineClients);
        editMessage(socket,clientsInChat);
        userReadMessage(socket);
        newEvent(socket,onlineClients);
        newGroupChat(socket, onlineClients);
        deleteGroupChat(socket, onlineClients);
        deleteUserFromGroupChat(socket, onlineClients);

    });

}

module.exports = runWebsocketsIO;
