import { Action} from '@ngrx/store';
import {types} from '../types/types';


export enum ActionTypes {
  UPDATE_CHAT_LIST = 'chat_list',
  INIT_USER_MODEL = 'user_model',
  NO_UNREAD_MESSAGES = 'no_unread_messages',
  UPDATE_AVATAR = 'update_avatar'
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
