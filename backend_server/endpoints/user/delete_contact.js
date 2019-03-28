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

router.post('/delete_contact', async function (req, res, next) {
    let auth;
    if(!req.headers['authorization']) {
      return res.sendStatus(401)
    }
    try {
      auth = jwt.decode(req.headers['authorization'], req.headers['token_key']);
    } catch (err) {
      return res.sendStatus(401)
    }
  
    const dataObj = req.body;
    const params = {
      query: {username: dataObj.username},
      objNew: {$pull: {contacts: {id: dataObj.contactUsername}}}
    }
    try {
      const updateRes = await datareader(User, params, 'updateOne');
      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(500);
    }
  
  });

module.exports = router;