import * as socketIo from 'socket.io';
import { UserActionsSocket } from '../../interfaces/types';
import { StoreService } from '../../services/store-service';

export function userLeft(socket: socketIo.Socket, access_token: string, storeService: StoreService): void {
    socket.on('user_left', (obj: UserActionsSocket) => {
        if (!obj) {
          return;
        }
        const onlineClient = storeService.getOnlineClients(obj.userId);
        try {
            storeService.deleteOnlineClients(obj.userId, access_token);
            socket.broadcast.emit('user_left', {userId: obj.userId});
        } catch (error) {
            console.error('user_left', error);
            if (obj && onlineClient) {
              Object.keys(onlineClient).forEach(token => {
                onlineClient[token].emit('error', {event: 'user_left', error});
              });
            }
           }
      });
}
