import * as db from './db';
import {model, Model} from "mongoose";

const confUser = new db.default.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true, select: false},
    name: {type: String},
    expireAt: {type: Date , default: Date.now, index: {expires: '10m'} }
});

export const ConfUser: Model<any> = model('ConfUser', confUser);