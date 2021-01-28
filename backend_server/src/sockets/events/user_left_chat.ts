import * as socketIo from 'socket.io';
import { UserActionsSocket } from '../../interfaces/types';
import { StoreService } from '../../services/store-service';

export function userLeftChat(socket: socketIo.Socket, access_token: string, storeService: StoreService): void {
    socket.on('user_left_chat', (obj: UserActionsSocket) => {
        if (!obj) {
          return;
        }
        const {userId, chatIdCurr} = obj;
          try {
            storeService.deleteClientInChat(chatIdCurr, userId, access_token);
          } catch (error) {
            console.error('user_left_chat', error);
            const onlineClient = storeService.getOnlineClients(userId);
            if (onlineClient[obj.userId]) {
              Object.keys(onlineClient).forEach(token => {
                onlineClient[token].emit('error', {event: 'user_left_chat', error});
              });
            }
          }
    });
}
