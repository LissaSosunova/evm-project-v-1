const router = require('express').Router();
const jwt = require('jwt-simple');
const Event = require('../../models/event');
const config = require('../../config');

router.get('/event/:id/', function (req, res, next) {
    let auth;
    if(!req.headers['authorization']) {
      return res.sendStatus(401)
    }
    try {
      auth = jwt.decode(req.headers['authorization'], req.headers['token_key']);
    } catch (err) {
      return res.sendStatus(401)
    }
    Event.findOne({
      $or: [
        {_id: req.params.id},
        {name: req.params.name} // не вижу, где ты передаёшь name в url
      ]
    }, function(err, event) {
      if (err) {
        return res.sendStatus(500)}
      else {
        return res.json(event);
  
      }
    })
  });

module.exports = router;