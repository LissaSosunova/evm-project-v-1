class EventData {
    constructor(event) {
      this.id = event._id;
      this.name = event.name;
      this.status = event.status;
      this.date = event.date;
      this.date_type = event.date_type;
      this.notification = event.notification;
    }
  }

  module.exports = EventData;