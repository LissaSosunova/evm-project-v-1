const db = require('./db');


const messageItem = db.Schema({
    chatID: {type: String},
    authorId: {type: String},
    destination: {type: String},
    text: {type: String},
    edited: {type: Boolean},
    read: {type: Boolean},
    date: {type: String},
    time: {type: String},
});

//Chat types: 1 - private chat, 2 - group chat | event chat, 3 - blocked chat, 4 - deleted chat
const chat = db.Schema({
    users:[String],
    email:[String],
    messages: [messageItem],
    type: {type: Number}
});

module.exports = db.model('Chat', chat);
