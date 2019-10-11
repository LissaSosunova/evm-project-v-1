import { Action } from '@ngrx/store';
import {types} from '../types/types';
import * as userAction from './actions';

const userInitState: types.User = {
  username: '',
  email: '',
  name: '',
  phone: '',
  contacts: [],
  events:  [],
  chats: [],
  avatar: {url: '', owner: ''},
  notifications: []
};

export function userReducer(state: types.User = userInitState, action: any): types.User {
  const updateState: types.User = {...state};
  switch (action.type) {
    case userAction.ActionTypes.UPDATE_CHAT_LIST: {
      const newMessage: types.Message = action.payload;
      updateState.chats.forEach(item => {
        if (item.chatId === newMessage.chatID) {
          item.lastMessage = newMessage;
          newMessage.unread.forEach(unreadUser => {
            if (unreadUser === updateState.username) {
              item.unreadMes++;
            }
          });
        }
      });
      updateState.chats.sort(sortChats);
      return updateState;
      }
    case userAction.ActionTypes.INIT_USER_MODEL: {
      const user: types.User = action.payload;
      state = user;
      user.chats.sort(sortChats);
      return user;
    }
    case userAction.ActionTypes.NO_UNREAD_MESSAGES: {
      const payload: {unread: number; chatId: string} = action.payload;
      updateState.chats.forEach(chatItem => {
        if (chatItem.chatId === payload.chatId) {
          chatItem.unreadMes = payload.unread;
        }
      });
      return updateState;
    }

    case userAction.ActionTypes.UPDATE_AVATAR: {
      const payload: types.Avatar = action.payload;
      updateState.avatar = payload;
      return updateState;
    }

    case userAction.ActionTypes.DELETE_MESSAGE: {
      const deletedMessage: types.DeleteMessage = action.payload;
      updateState.chats.forEach(chat => {
        if (chat.chatId === deletedMessage.chatId) {
          chat.unreadMes--;
        }
      });
      return updateState;
    }
    case userAction.ActionTypes.ADD_USER: {
      const contact: types.Contact = action.payload;
      updateState.contacts.push(contact);
      return updateState;
    }
    case userAction.ActionTypes.CONFIRM_USER: {
      const userConf: {userId: string} = action.payload;
      updateState.contacts.find(contact => {
        if (contact.id === userConf.userId) {
          contact.status = 1;
        }
        return contact.id === userConf.userId;
      });
      return updateState;
    }
    case userAction.ActionTypes.DELETE_REQUEST: {
      const deleteUserId: {userId: string} = action.payload;
      updateState.contacts.find((contact, index) => {
        if (contact.id === deleteUserId.userId) {
          updateState.contacts.splice(index, 1);
        }
        return contact.id === deleteUserId.userId;
      });
      return updateState;
    }
    case userAction.ActionTypes.DELETE_CONTACT: {
      const payload: {userId: string; chatId: string} = action.payload;
      updateState.contacts.find((contact, index) => {
        if (contact.id === payload.userId) {
          updateState.contacts.splice(index, 1);
        }
        return contact.id === payload.userId;
      });
      updateState.chats.find((chat, index) => {
        if (chat.chatId === payload.chatId) {
          updateState.chats.splice(index, 1);
        }
        return chat.chatId === payload.chatId;
      });
      return updateState;
    }
    case userAction.ActionTypes.ADD_CHAT: {
      const newChat: types.Chats = action.payload;
      updateState.chats.push(newChat);
      return updateState;
    }
    case userAction.ActionTypes.NEW_EVENT: {
      const newEvent: types.EventDb = action.payload;
      updateState.events.push(newEvent);
      return updateState;
    }
    default:
      return state;
    }

  }

function sortChats(a: types.Chats, b: types.Chats): number {
  if (!a.lastMessage || !b.lastMessage) {
    return 1;
  } else if (a.lastMessage.date < b.lastMessage.date) {
    return 1;
  } else {
    return -1;
  }
}
