import { Action} from '@ngrx/store';
import {types} from '../types/types';


export enum ActionTypes {
  UPDATE_CHAT_LIST = 'chat_list',
  INIT_USER_MODEL = 'user_model'
}

export class UpdateChatList implements Action {
  public readonly type = ActionTypes.UPDATE_CHAT_LIST;

  constructor(public payload: types.Message) {}
}

export class InitUserModel implements Action {
  public readonly type = ActionTypes.INIT_USER_MODEL;

  constructor(public payload: types.User) {}
}
