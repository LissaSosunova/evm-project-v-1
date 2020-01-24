import * as db from './db';
import {model, Model, Schema} from 'mongoose';
import { PendingRegUser } from '../interfaces/types';

const confUser: Schema<PendingRegUser> = new db.default.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true, select: false},
    name: {type: String},
    expireAt: {type: Date , default: Date.now, index: {expires: '10m'} }
});

export const ConfUser: Model<PendingRegUser> = model('ConfUser', confUser);
