const db = require('./db');

const findContact = db.Schema({
  id: { type: String },
  email: { type: String },
  name: { type: String },
  avatar: { type: Object },
});

module.exports = db.model('FindContact', findContact);
