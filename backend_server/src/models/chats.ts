import * as db from './db';
import {model, Model, Schema, Document } from 'mongoose';
import { ChatDb } from '../interfaces/types';

const messageItem = new db.default.Schema({
    chatID: {type: String},
    authorId: {type: String},
    text: {type: String},
    edited: {type: Boolean},
    unread: [String],
    date: {type: Number} // timestamp
});

const draftMessageItem = new db.default.Schema({
    chatID: {type: String},
    authorId: {type: String},
    text: {type: String},
    date: {type: Number}
});

const userItem = new db.default.Schema({
    username: {type: String},
    name: {type: String},
    email: {type: String},
    avatar: {type: Object},
    deleted: {type: Boolean}
});

// Chat types: 1 - private chat, 2 - group chat | event chat, 3 - blocked chat, 4 - deleted chat
const chat: Schema<ChatDb> = new db.default.Schema({
    users: [userItem],
    draftMessages: [draftMessageItem],
    messages: [messageItem],
    type: {type: Number},
    chatName: {type: String}, // for group chats
    admin: {type: String} // for group chats
});

export const Chat: Model<ChatDb> = model('Chat', chat);
