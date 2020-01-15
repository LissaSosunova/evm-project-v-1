// Depricated!!! Moved to sockets
const router = require('express').Router();
const jwt = require('jwt-simple');
const Event = require('../../models/event');
const User = require('../../models/user');
const config = require('../../config');
const datareader = require('../../modules/datareader');

class EventData {
    constructor(event) {
      this.id = event._id;
      this.name = event.name;
      this.status = event.status;
      this.date = event.date;
      this.date_type = event.date_type;
      this.notification = event.notification;
    }
  }

  router.post('/new_event', function (req, res, next){
    let auth;
    if(!req.headers['authorization']) {
      return res.sendStatus(401)
    }
    try {
      auth = jwt.decode(req.headers['authorization'], req.headers['token_key']);
    } catch (err) {
      return res.sendStatus(401)
    }
    const params = {
      $or: [
        {username: auth.username},
        {email: auth.username}
      ]
    };
    const event = new Event;
    event.name = req.body.name;
    event.status = req.body.status;
    event.date_type = req.body.date_type;
    event.date = req.body.date;
    event.place = req.body.place;
    event.members = req.body.members;
    event.additional = req.body.additional;
    event.notification = { type: 'event', message: 'You are invited to new event', id: '', status: true};
    event.save(function (err) {
      if (err) { res.json(err)}
      else {
        const createdEvent = new EventData(event);
        datareader(User, params, 'findOne')
          .then((response) =>{
            User.updateOne({username: response.username}, {$push: {events:createdEvent}}, (e, d) => {
              if (e) throw new Error(e);
              else return response;
            })
          })
          .then((response) =>{
            if(event.members && event.members.invited && event.members.invited.length !== 0){
              event.notification.id = event._id;
              event.members.invited.forEach(item => {
                User.updateOne({username: item}, {$push: {events:createdEvent}}, (e, d) => {
                  if (e) throw new Error(e);
                  else {
                    return response;
                  }
                });
                if(event.status === true){
                  User.updateOne({username: item}, {$push: {notifications:event.notification}}, (e, d) => {
                    if (e) throw new Error(e);
                    else return response;
                  });
                }
              });
            }
          })
          .then((response) => {
            res.json({status: 200, message: "Saved", eventId: createdEvent.id});
          })
      }
    })
  });

  module.exports = router;