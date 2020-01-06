import { Message, ChatDataObj } from "../interfaces/types";

export class ChatData {
    public id: string;
    public email: string[];
    public users: string[];
    public messages: Message[];

    constructor(chat: ChatDataObj) {
        this.id = chat._id;
        this.users = chat.users;
        this.email = chat.email;
        this.messages = chat.messages;
    }
}