import { Message, ChatDataObj, UsersInChatDb } from '../interfaces/types';

export class ChatData {
    public id: string;
    public users: UsersInChatDb[];
    public messages: Message[];

    constructor(chat: ChatDataObj) {
        this.id = chat._id;
        this.users = chat.users;
        this.messages = chat.messages;
    }
}
