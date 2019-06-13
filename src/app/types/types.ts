import { constants } from '../constants/default-constants';

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

  export interface ChatData {
    _id: string;
    email: string[];
    users: string[];
    messages: Message[];
    type: ChatType;
  }

  export interface Chats {
    _id: string;
    avatar: string;
    chatId: string;
    id: string;
    name: string;
    users: CreateNewChatUser[];
    type: number;
    unreadMes: number;
    lastMessage: Message;
  }

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
    events: EventDb [];
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

  export interface EventDb {
    _id?: string;
    name: string;
    status: boolean;
    date_type: string;
    date: EventDateDb;
    place: eventPlace;
    members: eventMembers;
    additional: string;
    notification?: eventNotification;
  }

  export interface EventDateDb {
    startDate: number;
    endDate?: number;
  }

  export interface EventUI {
    name: string;
    status: boolean;
    dateType: dateTypeEvent;
    date: eventDate;
    place: eventPlace;
    members: eventMembers;
    additional: string;
    notification?: eventNotification;
  }

  export enum dateTypeEvent {
    EXACT_DATE = 'exact date',
    EXACT_DATE_WITH_TIME = 'exact date with time',
    DIAPASON_OF_DATES = 'diapason of dates',
    DIAPASON_OF_DATES_WITH_TIME = 'diapason of dates with time'
  }

  export interface eventDate {
    startDate: Date;
    startHours?: number;
    startMinutes?: number;
    endDate?: Date;
    endHours?: number;
    endMinutes?: number;
  }

  export interface eventPlace {
    location: string
  }

  export interface eventNotification {
    type: string;
    message: string;
    id: string;
    status: boolean
  }

  export interface eventMembers {
    invited: string[]
  }

  export interface DraftMessage {
    chatID: string;
    authorId: string;
    text: string;
    date: number;
  }

  export interface DraftMessageDeleteObj {
    chatID: string;
    authorId: string;
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
    _id?: string;
    chatID: string;
    authorId: string;
    text: string;
    users: string[];
    edited: boolean;
    unread?: string[];
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
  users: CreateNewChatUser[];
}

export interface CreateNewChatUser {
  username: string;
  name: string;
  email: string;
}

export interface arrayOfUsersForMessage {
  username: string;
  name: string;
  email: string;
  _id: string;
}

export interface UserIsTyping {
  userId: string;
  name: string;
  users: any[];
  chatId: string;
  typing: boolean;
}

  export const getURI = () => {
    return `${constants.localBackEnd.protocol}://${constants.localBackEnd.host}:${constants.localBackEnd.port}`;
  };

  export type StepState = 'login' | 'registration' | 'about' | 'main';

  export enum ChatType {
    PRIVATE_CHAT = 1,
    GROUP_OR_EVENT_CHAT = 2,
    BLOCKED_CHAT = 3,
    DELETED_CHAT = 4
  }

}
