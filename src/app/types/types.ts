import { constants } from '../constants/default-constants';

export module types {

  export interface Login {
    username: string;
    password: string;
  }

  export interface LoginResp {
    success: boolean;
    access_token: string;
  }

  export interface Registration {
    username: string;
    email: string;
    password: string;
  }
  
  export interface User {
    username: string;
    email: string;
    name: string;
    phone: string;
    contacts: Contacts[];
    events: [ object ]; // конкретизируй тип объекта, сделай как сделал для контактов
    chats: Chats[];
    avatar: object;
    notifications: [ object ]; // конкретизируй тип объекта, сделай как сделал для контактов
  }

  export interface Contacts {
    avatar: string;
    email: string;
    id: string;
    name: string;
    private_chat: string;
    _id: string;
  }

  export interface Chats {
    avatar: string;
    name: string;
    _id: string;
    id: string;
  }

  export interface Message {
    chatID: string;
    authorId: string;
    destination: string;
    text: string;
    isSelected: boolean;
    edited: boolean;
    read: boolean;
    date: string;
    time: string; // дату и время надо будет поменять на timeStamp (to UTC)
  }

  export const getURI = () => {
    return `${constants.localBackEnd.protocol}://${constants.localBackEnd.host}:${constants.localBackEnd.port}`;
  };

  export type StepState = 'login' | 'registration' | 'about' | 'main';

}
