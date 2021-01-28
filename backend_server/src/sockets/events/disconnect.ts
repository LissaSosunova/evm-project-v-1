import * as socketIo from 'socket.io';
import { StoreService } from '../../services/store-service';

export function disconnectUser(socket: socketIo.Socket, access_token: string, storeService: StoreService): void {
    socket.on('disconnect', obj => {
        console.log(`User ${(socket as any).userId} is offline`);
        if (!socket) {
          return;
        }
        try {
            const userId = (socket as any).userId;
            const chatId = (socket as any).chatIdCurr;
            storeService.deleteOnlineClients(userId, access_token);
            storeService.deleteClientInChat(chatId, userId, access_token);
        } catch (error) {
          console.error('disconnect', error);
          const userId = (socket as any).userId;
          const onlineClient = storeService.getOnlineClients(userId);
          if (onlineClient) {
            Object.keys(onlineClient).forEach(token => {
              onlineClient[token].emit('error', {event: 'disconnect', error});
            });
          }
        }
    });
}
