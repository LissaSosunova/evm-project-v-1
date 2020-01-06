import { EventDateDb, EventNotification, EventDb } from "../interfaces/types";

export class EventData {
    public id: string;
    public name: string;
    public status: boolean;
    public date: EventDateDb;
    public date_type: string;
    public notification: EventNotification

    constructor(event: EventDb) {
      this.id = event._id;
      this.name = event.name;
      this.status = event.status;
      this.date = event.date;
      this.date_type = event.date_type;
      this.notification = event.notification;
    }
  }