const db = require('./db');


const messageItem = db.Schema({
    chatID: {type: String},
    authorId: {type: String},
    text: {type: String},
    edited: {type: Boolean},
    unread: [String],
    date: {type: Number} // timestamp
});

const draftMessageItem = db.Schema({
    chatID: {type: String},
    authorId: {type: String},
    text: {type: String},
    date: {type: Number}
});

const userItem = db.Schema({
    username:{type: String},
    name:{type: String},
    email:{type: String}
});

//Chat types: 1 - private chat, 2 - group chat | event chat, 3 - blocked chat, 4 - deleted chat
const chat = db.Schema({
    users:[userItem],
    draftMessages: [draftMessageItem],
    messages: [messageItem],
    type: {type: Number}
});

module.exports = db.model('Chat', chat);
