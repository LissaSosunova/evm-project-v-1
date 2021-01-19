import { ModelUpdateOptions, Document } from 'mongoose';
import * as socketIo from 'socket.io';

export interface LoginResponse {
    success: boolean;
    access_token: string;
    token_key: string;
    expires_in: number;
}

export interface DbQuery {
    query?: any;
    objNew?: any;
    multi?: ModelUpdateOptions;
    elementMatch?: any;
    queryField1?: any;
    contidition?: any;
    queryField2?: any;
}

export interface DeleteChatObj {
    myId: string;
    contactId: string;
}

export interface DeleteDraftMessageObj {
    chatID: string;
    authorId: string;
}

export interface DraftMessageFromServer {
    draftMessages: DraftMessageDb[];
    _id: string;
}


export interface UserActionsSocket {
    userId: string;
    chatIdCurr?: string;
}

export interface OnlineClients {
    [userId: string]: TokenObj;
}

interface TokenObj {
    [token: string]: socketIo.Socket;
}

export interface ClientsInChat {
    [chatId: string]: UserIdObj;
}

interface UserIdObj {
    [userId: string]: TokenObj;
}

export interface Server200Response {
    status: number;
    message: string;
}

export interface AddUserScoketIo {
    queryUserId: string;
    userId: string;
}

export interface DeleteContactSocketIo {
    userId: string;
    deleteContactId: string;
    chatIdToDelete: string;
    deleteChat: boolean;
}

export interface DeleteUserFromChatSocketIO {
    chatId: string;
    userToDelete: string;
    admin: string;
}

export interface DeleteGroupChat {
    chatId: string;
    admin: string;
    users: UserItem[];
}

export interface UserLeftChat {
    userId: string;
    chatId: string;
}

export interface UserItem {
    username: string;
    name: string;
    email: string;
}

export interface NewGroupChat {
    chatName: string;
    admin: string;
    users: UserItem[];
}

export interface AddUserToChat {
    chatId: string;
    admin: string;
    username: string;
    user: UserItem;
    chatName: string;
}

export interface DeleteMessageSocketIO {
    userId: string;
    authorId: string;
    messageId: string;
    chatId: string;
    unread: string[];
}

export interface EditMessageSocketIO {
    text: string;
    userId: string;
    chatId: string;
    messageId: string;
    authorId: string;
}

export interface UserReadMessage {
    userId: string;
    chatId: string;
}

export interface FoundContactObj {
    username: string;
    email: string;
    name: string;
    avatar: Avatar;
}

export interface UserIsTyping {
    userId: string;
    name: string;
    users: string[];
    chatId: string;
    typing: boolean;
}

export interface ChangeEmailReq {
    newEmail: string;
    username: string;
}

export interface NewPrivateChatReq {
    users: NewPrivateChatObj[];
}

export interface NewPrivateChatObj {
    username: string;
    name: string;
    email: string;
}

export interface ChangePasswordObj {
    tokenTime: string;
    password: string;
}

export interface ChangePasswordAuthObj {
    newPassword: string;
    oldPassword: string;
}

export interface DeleteContactObj {
    contactUsername: string;
    username: string;
}

export interface EditProfile {
    name: string;
    phone: string;
}

export interface PendingRegUser extends Document {
    username: string;
    name: string;
    email: string;
    password: string;
    expireAt: {any: any};
}

export interface Avatar {
    url?: string;
    owner: string;
    avatar?: AvatarObject;
}

export interface AvatarObject {
    contentType: string;
    image: string;
}

export interface UserDataObj extends Document {
    username: string;
    email: string;
    name: string;
    phone: string;
    contacts: Contact[];
    events: EventDb [];
    chats: Chats[];
    avatar: Avatar;
    password?: string;
    notifications: Notifications [];
    private_chat?: string; // TO DO
    status?: ChatType;  // TO DO
}

export interface Contact {
    avatar: Avatar;
    email: string;
    id: string;
    name: string;
    private_chat: string;
    _id?: string;
    status: number;
}

export interface EventDb extends Document {
    _id: string;
    name: string;
    status: boolean;
    date_type: string;
    date: EventDateDb;
    place: EventPlace;
    members: EventMembers;
    additional: string;
    notification?: EventNotification;
    authorId: string;
}

export interface Chats {
    _id?: string;
    avatar: Avatar | string;
    chatId: string;
    id?: string;
    name: string;
    users: CreateNewChatUser[];
    type: number;
    unreadMes?: number;
    lastMessage?: Message;
}

  export interface Notifications {
    type: string;
    message: string;
    _id: string;
    id: string;
    status: boolean;
}

export interface EventDateDb {
    startDate: number;
    endDate?: number;
}

export interface EventPlace {
    location: string;
}

export interface EventMembers {
    invited: string[];
}

export interface EventNotification {
    type: string;
    message: string;
    id: string;
    status: boolean;
}

export interface CreateNewChatUser {
    username: string;
    name: string;
    email: string;
}

export interface Message {
    _id?: string;
    chatID: string;
    authorId: string;
    text: string;
    users?: UsersInChatDb[];
    edited: boolean;
    unread?: string[];
    date: number; // timeStamp (to UTC)
}


export interface ChatDataObj {
    _id: string;
    users: UsersInChatDb[];
    messages: Message[];
    type: ChatType;
}

export interface ChatDb extends Document {
    _id: string;
    users: UsersInChatDb[];
    messages: Message[];
    draftMessages: DraftMessageDb[];
    type: ChatType;
    chatName?: string;
    admin?: string;
}

export interface UsersInChatDb {
    _id?: string;
    username: string;
    name: string;
    email: string;
    avatar?: Avatar;
    deleted?: boolean;
}

export interface DraftMessageDb {
    _id: string;
    chatID: string;
    authorId: string;
    text: string;
    date: number;
}

export enum ChatType {
    PRIVATE_CHAT = 1,
    GROUP_OR_EVENT_CHAT = 2,
    BLOCKED_CHAT = 3,
    DELETED_CHAT = 4
}

export interface EventDateDb {
    startDate: number;
    endDate?: number;
}

export interface EventNotification {
    type: string;
    message: string;
    id: string;
    status: boolean;
}


export interface Config {
    secretkeyForEmail: string;
    secretkeyForPasswordReset: string;
    secretKeyForRefreshToken: string;
    filesDomain: string;
    confirmEmail: boolean;
    backendDomain: string;
    frontendDomain: string;
    expireResetPasswordLink: number;
    expireChangeEmailLink: number;
    mongodb: string;
    backendPort: number;
    frontendPort: number;
    tokenExpiration: number;
    version: string;
}

export interface Auth {
    username: string;
    id: string;
}
