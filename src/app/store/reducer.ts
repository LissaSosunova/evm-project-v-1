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

export function userReducer(state: types.User = userInitState, action: any) {
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
    default:
      return state;
    }

  }

  function sortChats(a: types.Chats, b: types.Chats): number {
  if (a.lastMessage && a.lastMessage.date < b.lastMessage.date) {
    return 1;
  }
  else {
    return -1;
  }
}

