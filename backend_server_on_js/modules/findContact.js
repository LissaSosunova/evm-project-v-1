class FindContact {
    constructor(FoundContact) {
      this.id = FoundContact.username;
      this.email = FoundContact.email;
      this.name = FoundContact.name;
      this.avatar = FoundContact.avatar;
    }
}

module.exports = FindContact;