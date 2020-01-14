import { ClientsInChat, UserIsTyping } from '../../interfaces/types';
import * as socketIo from 'socket.io';

export function userIsTyping(socket: socketIo.Socket, clientsInChat: ClientsInChat): void {
    socket.on('user_is_typing', (obj: UserIsTyping) => {
        if (clientsInChat[obj.chatId]) {
          Object.keys(clientsInChat[obj.chatId]).forEach(userId => {
            Object.keys(clientsInChat[obj.chatId][userId]).forEach(token => {
              if (obj.userId !== userId) {
                clientsInChat[obj.chatId][userId][token].emit('user_is_typing', obj);
              }
            });
          });
        }
    });

}
