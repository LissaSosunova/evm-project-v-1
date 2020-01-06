import * as socketIo from 'socket.io';
import { UserActionsSocket, OnlineClients, ClientsInChat } from '../interfaces/types';
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


export function runWebsocketsIO(server): void {
    const onlineClients: OnlineClients = {};
    const clientsInChat: ClientsInChat = {};
    const io: socketIo.Server = socketIo.listen(server);
    console.info('Socket IO is running');

    io.on('connection', socket => {
        console.info('new connection');

        socket.on('user', (obj: UserActionsSocket) => {
            if (!onlineClients[obj.userId]) {
                onlineClients[obj.userId] = {};
              }
              (socket as any).userId = obj.userId;
              (socket as any).token = obj.token;
              onlineClients[obj.userId][obj.token] = socket;
              socket.emit("all_online_users", Object.keys(onlineClients));
              socket.broadcast.emit("user", {userId: obj.userId});
        });

        socket.on('user_left', (obj: UserActionsSocket) => {
             try {
                delete onlineClients[obj.userId][obj.token];
                if (Object.keys(onlineClients[obj.userId]).length === 0) {
                  delete onlineClients[obj.userId];
                }
                socket.broadcast.emit("user_left", {userId: obj.userId});
             } catch (err) {
               console.error('user_left', err);
             }
        });

        socket.on('user_in_chat', (obj: UserActionsSocket) => {
            if (!clientsInChat[obj.chatIdCurr]) {
                clientsInChat[obj.chatIdCurr] = {};
            }
            if (!clientsInChat[obj.chatIdCurr][obj.userId]) {
                clientsInChat[obj.chatIdCurr][obj.userId] = {}
            }
            (socket as any).userId = obj.userId;
            (socket as any).token = obj.token;
            (socket as any).chatIdCurr = obj.chatIdCurr;
            clientsInChat[obj.chatIdCurr][obj.userId][obj.token] = socket;
        });

        socket.on('user_left_chat', (obj: UserActionsSocket) => {
            try {
              delete clientsInChat[obj.chatIdCurr][obj.userId][obj.token];
              if (Object.keys(clientsInChat[obj.chatIdCurr][obj.userId]).length === 0) {
                  delete clientsInChat[obj.chatIdCurr][obj.userId];
              }
              if (Object.keys(clientsInChat[obj.chatIdCurr]).length === 0) {
                  delete clientsInChat[obj.chatIdCurr]
              }
            } catch (err) {
              console.error('user_left_chat', err);
            }
        });

        socket.on('disconnect', obj => {
            console.info(`User ${(socket as any).userId} is offline`);
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
            } catch(err) {
              console.error('disconnect', err);
            }
          });

          addUser(socket, onlineClients);
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
          userReadMessage(socket);
    })
}