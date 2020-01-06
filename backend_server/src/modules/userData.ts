import { UserDataObj, Contact, EventDb, Chats, Avatar, Notifications } from '../interfaces/types';

export class UserData implements UserDataObj {
    public username: string;
    public email: string;
    public name: string;
    public phone: string;
    public status: number;
    public contacts: Contact[];
    public events: EventDb[];
    public chats: Chats[];
    public avatar: Avatar;
    public notifications: Notifications[];

    constructor(user: UserDataObj) {
      this.username = user.username;
      this.email = user.email;
      this.name = user.name;
      this.phone = user.phone;
      this.contacts = user.contacts;
      this.events = user.events;
      this.chats = user.chats;
      this.avatar = user.avatar;
      this.notifications = user.notifications;
    }
}