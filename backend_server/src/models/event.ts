import * as db from './db';
import {model, Model} from "mongoose";

const event = new db.default.Schema({
    name: {type: String, required: true},
    status: {type: Boolean, required: true},
    date_type: {type: String},
    date: {type: Object},
    place: { type: Object },
    members: {type: Object},
    additional: {type: String},
    notification: { type: Object},
    authorId: { type: String}
});

export const Event: Model<any> = model('Event', event);