import { Avatar, UserDataObj } from "../interfaces/types";

export class ContactData {
    public id: string;
    public email: string;
    public name: string;
    public avatar: Avatar;
    public private_chat: string;
    public status: string | number;

    constructor(user: UserDataObj) {
        this.id = user.username;
        this.email = user.email;
        this.name = user.name;
        this.avatar = user.avatar;
        this.private_chat = '0';
        this.status = user.status;
    }
}