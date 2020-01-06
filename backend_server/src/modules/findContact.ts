import { Avatar, FoundContactObj } from "../interfaces/types";

export class FindContact {
    public id: string;
    public email: string;
    public name: string;
    public avatar: Avatar;

    constructor(foundContact: FoundContactObj) {
      this.id = foundContact.username;
      this.email = foundContact.email;
      this.name = foundContact.name;
      this.avatar = foundContact.avatar;
    }
}