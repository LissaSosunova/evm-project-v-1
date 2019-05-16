import { constants } from '../constants/default-constants';
import { Observable } from 'rxjs';

export module types {

  export interface Contact {
    avatar: string;
    email: string;
    id: string;
    name: string;
    private_chat: string;
    _id: string;
    status: number;
  }

  export interface Contacts {
    contacts: Contact[];
  }

  export interface Chats {
    _id: string;
    avatar: string;
    chatId: string;
    id: string;
    name: string;
    type: number;
    unreadMes: number;
  }


  // export interface PrivateChat {
  //   _id: string,
  //   users: string[],
  //   email: string[]
  //   messages: Message[], 
  //   type: string
  // } 

  export interface Login {
    username: string;
    password: string;
  }

  export interface LoginResp {
    success: boolean;
    access_token: string;
    token_key: string;
  }

  export interface Registration {
    name: String;
    username: string;
    email: string;
    password: string;
  }

  export interface User {
    username: string;
    email: string;
    name: string;
    phone: string;
    contacts: Contact[];
    events: Events [];
    chats: Chats[];
    avatar: object;
    notifications: Notifications [];
  }

  export interface Notifications {
    type: string;
    message: string;
    _id: string;
    id: string;
    status: boolean;
  }

  export interface Events {
    name: string;
    status: boolean;
    date: object;
    place: object;
    members: object;
    additional: string;
    notification: object;
  }

  export interface FindUser {
    query: string;
  }
  export interface AddUser {
    query: string;
  }
  export interface Message {
    chatID: string;
    authorId: string;
    text: string;
    isSelected: boolean;
    edited: boolean;
    unread: string[];
    date: number; // timeStamp (to UTC)
  }

  export interface FormPopupConfig {
    position?: 'top-center'|'center-center';
    cssClass?: string;
    header?: string;
    isHeaderCloseBtn?: boolean;
    formId?: string;
    isFooter?: boolean;
    isHeader?: boolean;
    footer?: {
        isCloseBtn?: boolean;
        closeBtnText?: string;
        isSubmitBtn?: boolean;
        submitBtnText?: string;
        isSubmitLoading?: boolean;
        isSubmitDisabled?: boolean;
        isRemoveBtn?: boolean;
        removeBtnText?: string;
        isRemoveLoading?: boolean;
        btnOrder?: string[];
    };
}

export interface SocketMessage {
  name: string;
  payload: any;
}

export interface CreateNewChat {
  users: string[],
  email: string[]
}

  export const getURI = () => {
    return `${constants.localBackEnd.protocol}://${constants.localBackEnd.host}:${constants.localBackEnd.port}`;
  };

  export type StepState = 'login' | 'registration' | 'about' | 'main';


}
