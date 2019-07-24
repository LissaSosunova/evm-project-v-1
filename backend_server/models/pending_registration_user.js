const db = require('./db');

const confUser = db.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true, select: false},
    name: {type: String},
    expireAt: {type: Date , default: Date.now, index: {expires: '10m'} }
});

module.exports = db.model('ConfUser', confUser);
