import * as socketIo from 'socket.io';
import { UserActionsSocket } from '../../interfaces/types';
import { StoreService } from '../../services/store-service';

export function userConnection(socket: socketIo.Socket, access_token: string, storeService: StoreService): void {
    socket.on('user', (obj: UserActionsSocket) => {
        if (!obj) {
          return;
        }
        (socket as any).userId = obj.userId;
        (socket as any).token = access_token;
        storeService.setOnlineClient(obj.userId, access_token, socket);
        socket.emit('all_online_users', Object.keys(storeService.allOnlineClients));
        socket.broadcast.emit('user', {userId: obj.userId});
    });
}
