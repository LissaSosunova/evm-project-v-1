import * as socketIo from 'socket.io';
import { UserActionsSocket } from '../../interfaces/types';
import { StoreService } from '../../services/store-service';

export function userInChat(socket: socketIo.Socket, access_token: string, storeService: StoreService): void {
    socket.on('user_in_chat', (obj: UserActionsSocket) => {
        if (!obj) {
          return;
        }
        try {
          (socket as any).userId = obj.userId;
          (socket as any).token = access_token;
          (socket as any).chatIdCurr = obj.chatIdCurr;
          storeService.setClientsInChat(obj.chatIdCurr, obj.userId, access_token, socket);
        } catch (error) {
          const onlineClient = storeService.getOnlineClients(obj.userId);
          console.error('user_in_chat', error);
          if (obj && onlineClient) {
            Object.keys(onlineClient).forEach(token => {
              onlineClient[token].emit('error', {event: 'user_in_chat', error});
            });
          }
        }
    });
}
