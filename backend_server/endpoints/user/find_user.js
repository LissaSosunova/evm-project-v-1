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

class FindContact {
    constructor(FoundContact) {
      this.id = FoundContact.username;
      this.email = FoundContact.email;
      this.name = FoundContact.name;
      this.avatar = FoundContact.avatar;
    }
  }

  router.post('/find_user', async function (req, res, next) {
    let auth;
    let contact;
    const query = req.body.query;
    try {
      auth = jwt.decode(req.headers['authorization'], req.headers['token_key']);
    } catch (err) {
      return res.sendStatus(401)
    }
    const queryParam = {
      query: {$or:[{username: {$regex: query}}, {email: {$regex: query}}, {name: {$regex: query}}]},
      elementMatch: {avatar: 1, username: 1, email: 1,name: 1}
    };
    const params = {
      query: {$or: [
        {username: auth.username},
        {email: auth.username}
      ]},
      elementMatch: {contacts: 1}
    };
    try {
      const userDb = await datareader(User, params, 'findElementMatch')
      const result = await datareader(User, queryParam, 'findElementMatch');
      // убираем из результата поиска те контакты, которые уже есть в списке друзей у пользователья, который шлёт запрос
      const user = result.filter(user => {
        return userDb[0].contacts.every(contact => contact.id !== user.username)
      });
      let resp = [];
      user.forEach(item => {
        if(query != "" && auth.username !== item.username){
          contact = new FindContact(item);
          resp.push(contact);
        }
      });
      res.json(resp);
    } catch (err) {
      res.sendStatus(500);
    }
  });

  module.exports = router;