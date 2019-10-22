class UserData {
    constructor(user) {
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

module.exports = UserData;