import * as socketIo from 'socket.io';
import * as jwt from 'jwt-simple';
import { UserActionsSocket, OnlineClients, ClientsInChat, Auth } from '../interfaces/types';
import { addUser } from './events/add_user';
import { confirmUser } from './events/confirm_user';
import { deleteContact } from './events/delete_contact';
import { deleteMessage } from './events/delete_message';
import { deleteGroupChat } from './events/delete_group_chat';
import { deleteRequest } from './events/delete_request';
import { deleteUserFromGroupChat } from './events/delete_user_from_group_chat';
import { editMessage } from './events/edit_message';
import { message } from './events/message';
import { newEvent } from './events/new_event';
import { newGroupChat } from './events/new_group_chat';
import { userIsTyping } from './events/user_is_typing';
import { userReadMessage } from './events/user_read_message';
import { addUserToChat } from './events/add_user_to_chat';

export function runWebsocketsIO(server: any): void {
    const onlineClients: OnlineClients = {};
    const clientsInChat: ClientsInChat = {};
    const io: socketIo.Server = socketIo.listen(server);
    console.log('Socket IO is running');
    io.on('connection', (socket) => {
      /** User authentication */
        if (socket && socket.handshake && socket.handshake.query && !socket.handshake.query.token ||
          !socket.handshake.query.token_key) {
          console.error('Unauthorized user');
          return new Error('Unauthorized user');
        }
        let auth: Auth;
        try {
          auth = jwt.decode(socket.handshake.query.token, socket.handshake.query.token_key as string);
        } catch (err) {
          console.error('Error in decoding token');
          return new Error('Error in decoding token');
        }
        /** User authentication
         * Unauthorized are not allowed to connect to sockets
         */
        console.log('new connection ', auth);
        socket.on('user', (obj: UserActionsSocket) => {
          if (!obj) {
            return;
          }
            if (!onlineClients[obj.userId]) {
                onlineClients[obj.userId] = {};
              }
              (socket as any).userId = obj.userId;
              (socket as any).token = obj.token;
              onlineClients[obj.userId][obj.token] = socket;
              socket.emit('all_online_users', Object.keys(onlineClients));
              socket.broadcast.emit('user', {userId: obj.userId});
        });

        socket.on('user_left', (obj: UserActionsSocket) => {
          if (!obj) {
            return;
          }
             try {
                delete onlineClients[obj.userId][obj.token];
                if (Object.keys(onlineClients[obj.userId]).length === 0) {
                  delete onlineClients[obj.userId];
                }
                socket.broadcast.emit('user_left', {userId: obj.userId});
             } catch (error) {
               console.error('user_left', error);
               if (obj && onlineClients[obj.userId]) {
                Object.keys(onlineClients[obj.userId]).forEach(token => {
                  onlineClients[obj.userId][token].emit('error', {event: 'user_left', error});
                });
              }
             }
        });

        socket.on('user_in_chat', (obj: UserActionsSocket) => {
          if (!obj) {
            return;
          }
          try {
            if (!clientsInChat[obj.chatIdCurr]) {
              clientsInChat[obj.chatIdCurr] = {};
            }
            if (!clientsInChat[obj.chatIdCurr][obj.userId]) {
                clientsInChat[obj.chatIdCurr][obj.userId] = {};
            }
            (socket as any).userId = obj.userId;
            (socket as any).token = obj.token;
            (socket as any).chatIdCurr = obj.chatIdCurr;
            clientsInChat[obj.chatIdCurr][obj.userId][obj.token] = socket;
          } catch (error) {
            console.error('user_in_chat', error);
            if (obj && onlineClients[obj.userId]) {
              Object.keys(onlineClients[obj.userId]).forEach(token => {
                onlineClients[obj.userId][token].emit('error', {event: 'user_in_chat', error});
              });
            }
          }

        });

        socket.on('user_left_chat', (obj: UserActionsSocket) => {
          if (!obj) {
            return;
          }
            try {
              if (obj.chatIdCurr && obj.userId && obj.token) {
                delete clientsInChat[obj.chatIdCurr][obj.userId][obj.token];
              }
              if (Object.keys(clientsInChat[obj.chatIdCurr][obj.userId]).length === 0) {
                  delete clientsInChat[obj.chatIdCurr][obj.userId];
              }
              if (Object.keys(clientsInChat[obj.chatIdCurr]).length === 0) {
                  delete clientsInChat[obj.chatIdCurr];
              }
            } catch (error) {
              console.error('user_left_chat', error);
              if (onlineClients[obj.userId]) {
                Object.keys(onlineClients[obj.userId]).forEach(token => {
                  onlineClients[obj.userId][token].emit('error', {event: 'user_left_chat', error});
                });
              }
            }
        });

        socket.on('disconnect', obj => {
            console.log(`User ${(socket as any).userId} is offline`);
            if (!socket) {
              return;
            }
            try {
              if (onlineClients[(socket as any).userId] && onlineClients[(socket as any).userId][(socket as any).token]) {
                delete onlineClients[(socket as any).userId][(socket as any).token];
              }
              if (onlineClients[(socket as any).userId] && Object.keys(onlineClients[(socket as any).userId]).length === 0) {
                delete onlineClients[(socket as any).userId];
              }
              if ((socket as any).chatIdCurr && clientsInChat[(socket as any).chatIdCurr]) {
                delete clientsInChat[(socket as any).chatIdCurr][(socket as any).userId][(socket as any).token];
              }
              if (clientsInChat[(socket as any).chatIdCurr] &&
                clientsInChat[(socket as any).chatIdCurr][(socket as any).userId] &&
                Object.keys(clientsInChat[(socket as any).chatIdCurr][(socket as any).userId]).length === 0) {
                  delete clientsInChat[(socket as any).chatIdCurr][(socket as any).userId];
              }
            } catch (error) {
              console.error('disconnect', error);
              if (onlineClients[(socket as any).userId]) {
                Object.keys(onlineClients[(socket as any).userId]).forEach(token => {
                  onlineClients[(socket as any).userId][token].emit('error', {event: 'disconnect', error});
                });
              }
            }
          });

          addUser(socket, onlineClients);
          addUserToChat(socket, onlineClients);
          confirmUser(socket, onlineClients);
          deleteContact(socket, onlineClients);
          deleteGroupChat(socket, onlineClients);
          deleteMessage(socket, clientsInChat, onlineClients);
          deleteRequest(socket, onlineClients);
          deleteUserFromGroupChat(socket, onlineClients);
          editMessage(socket, clientsInChat);
          message(socket, onlineClients, clientsInChat);
          newEvent(socket, onlineClients);
          newGroupChat(socket, onlineClients);
          userIsTyping(socket, clientsInChat);
          userReadMessage(socket, onlineClients);
    });
}
