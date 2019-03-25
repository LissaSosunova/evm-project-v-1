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

// импортируем файл конфигурации (баловство, конечно, надо генерировать это на лету и хранить где-нибудь)
const config = require('../../config');

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
      auth = jwt.decode(req.headers['authorization'], config.secretkey);
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
      const promises = [];
      chatList.forEach(chat => {
        if(chat.chatId) {
          let queryParams = {
            query: {_id: chat.chatId},
            elementMatch: {
              messages:{
                $elemMatch:{
                  unread: userDb.username
                }
              }
            }
          };
        promises.push(datareader(Chat, queryParams, 'findElementMatch'));
        }
      });
      const unreadMes = await Promise.all(promises);
      console.log('unreadMes', unreadMes);
      const unreadNumInChats = [];
      unreadMes.forEach(item => {
        const obj = {};
        obj.chatId = String(item[0]._id);
        obj.unreadMes = item[0].messages.length;
        if (item[0].messages.length > 0) {
          obj.lastMessage = item[0].messages[0];
        }
        unreadNumInChats.push(obj);
      });
      user.chats.forEach(item => {
        unreadNumInChats.forEach(el => {
          if (item.chatId && item.chatId === el.chatId) {
            item.unreadMes = el.unreadMes;
            item.lastMessage = el.lastMessage;
          }
        })
      });
      res.json(user);
    } catch(err) {
      res.sendStatus(500);
    }
    
          
  });

  module.exports = router;