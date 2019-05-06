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
