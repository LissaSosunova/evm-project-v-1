import * as db from './db';
import {model, Model, Schema} from 'mongoose';
import { UserDataObj } from '../interfaces/types';

const userItem = new db.default.Schema({
    username: { type: String },
    name: { type: String },
    email: { type: String }
});

  const contact = new db.default.Schema({
    id: { type: String },
    name: { type: String },
    avatar: { type: Object },
    private_chat: { type: String },
    email: { type: String },
    status: { type: Number}
  });
  const eventNotification = new db.default.Schema({
    id: { type: String },
    type: { type: String },
    message: { type: String }
  });
  const chat = new db.default.Schema({
    id: { type: String },
    name: { type: String },
    avatar: { type: Object },
    chatId: { type: String },
    users: [userItem],
    type: { type: Number},
    unreadMes: {type: Number},
    lastMessage: {type: Object}
  });

  const event = new db.default.Schema({
    id: { type: String },
    name: { type: String },
    status: { type: Boolean },
    date: { type: Object },
    date_type: {type: String},
    notification: { eventNotification }
  });

  const notification = new db.default.Schema({
    id: { type: String },
    type: { type: String },
    message: { type: String },
    status: { type: Boolean}
  });

  const user: Schema<UserDataObj> = new db.default.Schema({
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

export const User: Model<UserDataObj> = model('User', user);
