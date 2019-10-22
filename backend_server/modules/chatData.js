class ChatData {
    constructor(chat) {
      this.id = chat._id;
      this.users = chat.users;
      this.email = chat.email;
      this.messages = chat.messages;
    }
}

module.exports = ChatData;