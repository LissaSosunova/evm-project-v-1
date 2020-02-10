const db = require('./db');

// var avatar = db.Schema({
//   id: {type: String},
//   owner: {type: String},
//   link: { type: String }
// });

const userItem = db.Schema({
  username: {type: String},
  name: {type: String},
  email: {type: String}
});

const contact = db.Schema({
  id: { type: String },
  name: { type: String },
  avatar: { type: Object },
  private_chat: { type: String },
  email: { type: String },
  status: { type: Number}
});
const eventNotification = db.Schema({
  id: { type: String },
  type: { type: String },
  message: { type: String }
});
const chat = db.Schema({
  id: { type: String },
  name: { type: String },
  avatar: { type: Object },
  chatId: { type: String },
  users: [userItem],
  // unreadMes: {type: Number},
  // lastMessage: {type: Object },
  type: { type: Number}
});

const event = db.Schema({
  id: { type: String },
  name: { type: String },
  status: { type: Boolean },
  date: { type: Object },
  date_type: {type: String},
  notification: { eventNotification }
});

const notification = db.Schema({
  id: { type: String },
  type: { type: String },
  message: { type: String },
  status: { type: Boolean}
});

const user = db.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true, select: false},
    name: { type: String },
    phone: { type: String },
    contacts: [ contact ],
    events: [ event ],
    chats: [ chat ],
    avatar: { type: Object },
    notifications: [ notification ]
});

module.exports = db.model('User', user);