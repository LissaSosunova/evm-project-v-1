const router = require('express').Router() // импортируем роутер
// плагин для аватрок
const multer = require('multer');
// импортируем JWT для декодирования web-token'ов
const jwt = require('jwt-simple');
// импортируем модель пользователя и евента
const User = require('../../models/user');
const Event = require('../../models/event');
const Avatar = require('../../models/avatar');
// схема для поиска контактов в БД
const FoundContact = require('../../models/findcontact');

const datareader = require('../../modules/datareader');
const Chat = require('../../models/chats');
const ObjectId =  require('mongodb').ObjectID;

// импортируем файл конфигурации (баловство, конечно, надо генерировать это на лету и хранить где-нибудь)
const config = require('../../config');
const UserData = require('../../modules/userData');


  /**
 * При поступлении запроса типа GET эта функция проверяет наличие заголовка типа X-Auth-Token, при его отсутствии
 * возвращает 401 - Unauthorized. При наличии расшифровывает токен, содержащийся в заголовке с помощью jwt,
 * затем ищет пользователя с оным именем в базе данных.
 * При любых ошибках возвращает JSON объекта error
 * При успехе возвращает JSON объекта user (без пароля, естественно)
 */


router.get('/user', async function (req, res, next) {
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

    try {
      const userDb = await datareader(User, params, 'findOne');
      const user = new UserData(userDb);
      const chatList = userDb.chats;
      const promisesUnreadNum = [];
      const promisesLastMes = [];
      chatList.forEach(chat => {
        if(chat.chatId) {
          const queryParams = {
            query: {"_id" : ObjectId(chat.chatId)},
            queryField1: 'messages',
            queryField2: 'unread',
            contidition: [user.username]
          };
          const queryParamsForLastMes = {
            query: {"_id" : ObjectId(chat.chatId)},
            elementMatch: {messages: {$slice: [0, 1]}}
          }
        promisesUnreadNum.push(datareader(Chat, queryParams, 'arrayFilter'));
        promisesLastMes.push(datareader(Chat, queryParamsForLastMes, 'findOneElementMatch'))
        }
      });

      const unreadMes = await Promise.all(promisesUnreadNum);
      const lastMes = await Promise.all(promisesLastMes);
      const unreadNumInChats = [];
      unreadMes.forEach(item => {
        const obj = {};
        if (item && item.length > 0) {
          obj.chatId = String(item[0]._id);
          obj.unreadMes = item[0].query.length;
          unreadNumInChats.push(obj);
        }
      });
      user.chats.forEach(item => {
        unreadNumInChats.forEach(el => {
          if (item.chatId && item.chatId === el.chatId) {
            item.unreadMes = el.unreadMes;
           
          }
        })
        lastMes.forEach(el => {
          if (el && item.chatId && item.chatId == el._id) {
             item.lastMessage = el.messages[0];
          }
        })
      });
      res.json(user);
    } catch(err) {
      console.error('/user', err);
      res.sendStatus(500);
    }


  });

  module.exports = router;
