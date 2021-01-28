import * as socketIo from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { Auth } from '../interfaces/types';
import { StoreService } from '../services/store-service';
import { cookiesToObject } from '../modules/cookies-Parser';
import { addUser } from './events/add_user';
import { addUserToChat } from './events/add_user_to_chat';
import { confirmUser } from './events/confirm_user';
import { deleteContact } from './events/delete_contact';
import { deleteGroupChat } from './events/delete_group_chat';
import { deleteMessage } from './events/delete_message';
import { deleteRequest } from './events/delete_request';
import { deleteUserFromGroupChat } from './events/delete_user_from_group_chat';
import { editMessage } from './events/edit_message';
import { message } from './events/message';
import { newEvent } from './events/new_event';
import { newGroupChat } from './events/new_group_chat';
import { userIsTyping } from './events/user_is_typing';
import { userLeftGroupChat } from './events/user_left_group_chat';
import { userReadMessage } from './events/user_read_message';
import { userConnection } from './events/user';
import { userLeft } from './events/user-left';
import { userInChat } from './events/user_in_chat';
import { userLeftChat } from './events/user_left_chat';
import { disconnectUser } from './events/disconnect';

export class SocketIOServer {

    private io: socketIo.Server;

    constructor(private server: any, private storeService: StoreService) {}

    public initServer(): void {
        this.io = socketIo.listen(this.server);
        console.log('Socket IO is running');
    }

    public onConnection(): void {
        this.io.on('connection', (socket: socketIo.Socket) => {
            /** User authentication */
            const cookies: string = socket.handshake.headers.cookie;
            const cookiesObj = cookiesToObject(cookies);
            const {access_token, token_key} = cookiesObj;
            let auth: Auth;
            try {
                auth = jwt.verify(access_token, token_key) as Auth;
            } catch (err) {
                console.error('Unauthorized user');
                return new Error('Unauthorized user');
            }
            /** User authentication
            * Unauthorized are not allowed to connect to sockets
            */
            console.log('new connection ', auth);
            const onlineClients = this.storeService.allOnlineClients;
            const clientsInChat = this.storeService.allClientsInChat;

            userConnection(socket, access_token, this.storeService);
            userLeft(socket, access_token, this.storeService);
            userInChat(socket, access_token, this.storeService);
            userLeftChat(socket, access_token, this.storeService);
            disconnectUser(socket, access_token, this.storeService);
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
            userReadMessage(socket, onlineClients, clientsInChat);
            userLeftGroupChat(socket, onlineClients, clientsInChat);
          });
    }
}
