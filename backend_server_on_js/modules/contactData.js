class ContactData {
    constructor(user) {
      this.id = user.username;
      this.email = user.email;
      this.name = user.name;
      this.avatar = user.avatar;
      this.private_chat = '0';
      this.status = user.status;
    }
}

module.exports = ContactData;