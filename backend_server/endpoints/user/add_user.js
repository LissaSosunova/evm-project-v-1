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

// Для контатов поле статуза имеет значение:
// status == 1 -- ПОДТВЕРДИЛИ ДОБАВЛЕНИЕ,
// status == 2 -- ЖДУТ ПОДТВЕРЖДЕНИЕ (от контакта, у которого в бд висит этот статус),
// status == 3 - ПРИГЛАШЕННЫЕ, НО НЕ ПОДТВЕРДИЛИ (контакт ждет, когда подтвердят добавление)

class ContactData {
    constructor(user) {
      this.id = user.username;
      this.email = user.email;
      this.name = user.name;
      this.avatar = user.avatar;
      this.private_chat = '0';
      this.status = user.status;
    }
  }

class UserData {
  constructor(user) {
    this.username = user.username;
    this.email = user.email;
    this.name = user.name;
    this.phone = user.phone;
    this.contacts = user.contacts;
    this.events = user.events;
    this.chats = user.chats;
    this.avatar = user.avatar;
    this.notifications = user.notifications;
  }
}

router.post('/add_user', async function (req, res, next) {
    let auth;
    let exsistCont = false;
    const query = req.body;
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
    try {
      const result = await datareader(User, params, 'findOne');
      result.contacts.forEach(item => {
        if (query.query === auth.username || item.id === query.query ) {
          exsistCont = true;
          }
      });
      if (query.query === auth.username) exsistCont = true;
      if (exsistCont) return res.json({message: "This contact is already exists"});

      const findRes = await datareader(User, {username: query.query}, 'findOne');
      findRes.private_chat = '0';
      findRes.status = 3;
      const contact = new ContactData(findRes);
      const updateParams = {
        query: params,
        objNew:  {$push: {contacts: contact}}
      };
      const updateRes = await datareader(User, updateParams, 'updateOne');

      //добавить найденому другу тоже со статусом ожидания подтверждения с его стороны
      const params2 = {
        $or: [
          {username: contact.id},
          {email: contact.email}
        ]
      };
      const result2 = new ContactData(result);
      result2.private_chat = '0';
      result2.status = 2;
      const addParams = {
        query: params2,
        objNew:  {$push: {contacts: result2}}
      };
      const updateFindedUser = await datareader(User, addParams, 'updateOne');
      //ответ сервера после обработки
      const responseUser = await datareader(User, params, 'findOne');
      const user = new UserData(responseUser);
      res.json(user);
    } catch(err) {
      res.sendStatus(500);
    }
  });

  module.exports = router;
