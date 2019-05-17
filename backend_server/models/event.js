const db = require('./db')
const event = db.Schema({
  name: {type: String, required: true},
  status: {type: Boolean, required: true},
  date_type: {type: String},
  date: {type: Object},
  place: { type: Object },
  members: {type: Object},
  additional: {type: String},
  notification: { type: Object}
});

module.exports = db.model('Event', event);
