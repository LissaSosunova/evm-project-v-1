import { Action} from '@ngrx/store';
import {types} from '../types/types';


export enum ActionTypes {
  UPDATE_CHAT_LIST = 'chat_list',
  INIT_USER_MODEL = 'user_model',
  NO_UNREAD_MESSAGES = 'no_unread_messages',
  UPDATE_AVATAR = 'update_avatar',
  DELETE_MESSAGE = 'delete_message',
  ADD_USER = 'add_user',
  CONFIRM_USER = 'confirm_user',
  DELETE_REQUEST = 'delete_request',
  DELETE_CONTACT = 'delete_contact',
  ADD_CHAT = 'add_chat'
}

export class UpdateChatList implements Action {
  public readonly type = ActionTypes.UPDATE_CHAT_LIST;

  constructor(public payload: types.Message) {}
}

export class InitUserModel implements Action {
  public readonly type = ActionTypes.INIT_USER_MODEL;

  constructor(public payload: types.User) {}
}

export class UserReadAllMessages implements Action {
  public readonly type = ActionTypes.NO_UNREAD_MESSAGES;

  constructor(public payload: {unread: number; chatId: string}) {}
}

export class UpdateAvatarURL implements Action {
  public readonly type = ActionTypes.UPDATE_AVATAR;

  constructor(public payload: types.Avatar) {}
}

export class DeleteMessageUpdate implements Action {
  public readonly type = ActionTypes.DELETE_MESSAGE;

  constructor(public payload: types.DeleteMessage) {}
}

export class AddUser implements Action {
  public readonly type = ActionTypes.ADD_USER;

  constructor(public payload: types.Contact) {}
}

export class ConfirmUser implements Action {
  public readonly type = ActionTypes.CONFIRM_USER;

  constructor(public payload: {userId: string}) {}
}

export class DeleteRequest implements Action {
  public readonly type = ActionTypes.DELETE_REQUEST;

  constructor(public payload: {userId: string}) {}
}

export class DeleteUser implements Action {
  public readonly type = ActionTypes.DELETE_CONTACT;

  constructor(public payload: {userId: string; chatId: string}) {}
}

export class AddChat implements Action {
  public readonly type = ActionTypes.ADD_CHAT;

  constructor(public payload: types.Chats) {}

}
