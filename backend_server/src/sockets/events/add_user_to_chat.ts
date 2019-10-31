import { User } from '../../models/user';
import { datareader } from '../../modules/datareader';
import { OnlineClients, AddUserToChat, UserItem, ChatDb, Chats } from '../../interfaces/types';
import * as socketIo from 'socket.io';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';
import { ObjectId } from 'mongodb';

export function addUserToChat(socket: socketIo.Socket, onlineClients: OnlineClients): void {
    socket.on('add_user_to_chat', async (obj: AddUserToChat) => {
        if (obj.admin !== obj.username) {
            return;
        }
        try {
            const findUserInfo = {
                query: {_id: new ObjectId(obj.chatId), 'users.username': obj.user.username},
                elementMatch: {users: 1}
              };
              const response: {_id: string, users: UserItem[]} = await datareader(Chat, findUserInfo, MongoActions.FIND_ONE_ELEMENT_MATCH);
              if (response) {
                  const restoreUserInChat = {
                      query: {_id: new ObjectId(obj.chatId), 'users.username': obj.user.username},
                      objNew: {$set: {'users.$.deleted': false}}
                  };
                  await datareader(Chat, restoreUserInChat, MongoActions.UPDATE_ONE);
                  const chatObj: Chats = {
                      name: obj.chatName,
                      users: response.users,
                      chatId: obj.chatId,
                      type: 2,
                      avatar: '' // add chat avatar
                  };
                  const addChatToUser = {
                      query: {username: obj.user.username},
                      objNew: {$push: {chats: chatObj}}
                  };
                  await datareader(User, addChatToUser, MongoActions.UPDATE_ONE);
                  if (onlineClients[obj.user.username]) {
                      Object.keys(onlineClients[obj.user.username]).forEach(token => {
                          onlineClients[obj.user.username][token].emit('add_user_to_chat', chatObj);
                      });
                  }
              } else {
                  const addUserToGroupChat = {
                      query: {_id: new ObjectId(obj.chatId)},
                      objNew: {$push: {users: obj.user}}
                  };
                  await datareader(Chat, addUserToGroupChat, MongoActions.UPDATE_ONE);
                  const findChat = {
                      query: {_id: new ObjectId(obj.chatId)},
                      elementMatch: {users: 1}
                  };
                  const res: {_id: string, users: UserItem[]} = await datareader(Chat, findChat, MongoActions.FIND_ELEMENT_MATCH);
                  const chatObj = {
                      name: obj.chatName,
                      users: res.users,
                      chatId: obj.chatId,
                      type: 2,
                      avatar: '' // add chat avatar
                  };
                  const addChatToUser = {
                      query: {username: obj.user.username},
                      objNew: {$push: {chats: chatObj}}
                  };
                  await datareader(User, addChatToUser, MongoActions.UPDATE_ONE);
                  if (onlineClients[obj.user.username]) {
                      Object.keys(onlineClients[obj.user.username]).forEach(token => {
                          onlineClients[obj.user.username][token].emit('add_user_to_chat', chatObj);
                      });
                  }
              }
              if (onlineClients[obj.admin]) {
                  Object.keys(onlineClients[obj.admin]).forEach(token => {
                      onlineClients[obj.admin][token].emit('add_user_to_chat_response',
                      {chatId: obj.chatId, userToAdd: obj.user});
                  });
              }
        } catch (error) {
            console.error('add_user_to_chat', error);
            if (onlineClients[obj.admin]) {
                Object.keys(onlineClients[obj.admin]).forEach(token => {
                  onlineClients[obj.admin][token].emit('error', {event: 'add_user_to_chat', error});
                });
              }
        }

    });
}
