const router = require('express').Router() // импортируем роутер
// плагин для аватрок
const multer = require('multer');
// импортируем JWT для декодирования web-token'ов
const jwt = require('jwt-simple');
// импортируем модель пользователя и евента
const User = require('../../models/user');
const datareader = require('../../modules/datareader');
// импортируем файл конфигурации (баловство, конечно, надо генерировать это на лету и хранить где-нибудь)
const config = require('../../config');

router.post('/confirm_user', async function (req, res, next) {
    let auth;
    const query = req.body;
    try {
      auth = jwt.decode(req.headers['authorization'], req.headers['token_key']);
    } catch (err) {
      return res.sendStatus(401)
    }
    const params1 = {username: auth.username};
    const params2 = {username: query.query};
  
    try {
      const response2 = await datareader(User, params2, 'findOne');
  
      User.updateOne({"username" : response2.username, "contacts.id": auth.username},
        {
          $set : { "contacts.$.status" : 1 }
        }, { upsert: true },
        function(err, result){
        }
      );
  
      const response1 = await datareader(User, params1, 'findOne')
      User.updateOne({"username" : response1.username, "contacts.id": query.query},
      {
        $set : { "contacts.$.status" : 1 }
      }, { upsert: true },
          function(err, result){
            console.log(result);
            res.sendStatus(200)
          }
        );
    } catch(err) {
      res.sendStatus(500);
    }
  
  });

module.exports = router;