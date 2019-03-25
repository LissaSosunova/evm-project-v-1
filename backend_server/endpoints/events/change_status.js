const router = require('express').Router();
const jwt = require('jwt-simple');
const User = require('../../models/user');
const config = require('../../config');
const datareader = require('../../modules/datareader');

router.post('/change_status/', function (req, res, next) {
    let auth;
    if(!req.headers['authorization']) {
      return res.sendStatus(401)
    }
    try {
      auth = jwt.decode(req.headers['authorization'], config.secretkey);
    } catch (err) {
      return res.sendStatus(401)
    }
    const idNotification = req.body.id;
    const params = {
      $or: [
        {username: auth.username},
        {email: auth.username}
      ]
    };
    datareader(User, params, 'findOne')
      .then(response =>{
        User.updateOne({"username" : response.username, "notifications.id" : idNotification},
          {
            $set : { "notifications.$.status" : false }
          }, { upsert: true },
          function(err, result){
          }
        );
        return res.sendStatus(200)
      })
  });
  
  module.exports = router;