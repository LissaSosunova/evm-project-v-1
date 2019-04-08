const router = require('express').Router() // импортируем роутер

// импортируем модуль bcrypt для шифрования паролей (мы же не собираемся хранить их в БД в открытом виде?)
const bcrypt = require('bcrypt');
// плагин для аватрок
const multer = require('multer');
// импортируем JWT для декодирования web-token'ов
const jwt = require('jwt-simple');
// импортируем модель пользователя и евента
const User = require('../../models/user');
const Avatar = require('../../models/avatar');
// схема для поиска контактов в БД
const datareader = require('../../modules/datareader');

// импортируем файл конфигурации (баловство, конечно, надо генерировать это на лету и хранить где-нибудь)
const config = require('../../config');


  /**
   * При поступлении запроса типа POST эта функция шифрует пароль с помощью bcrypt и сохраняет результат в БД.
   * При любых ошибках выдает статус 500 - Internal Server Error
   * 409 Conflict («конфликт») - при попытке добать юзера с уже существуещим емейлом или username
   * При удаче - возвращает 201
   */

  router.post('/user', function (req, res, next){

    const params = {
      $or: [
        {username: req.body.username},
        {email: req.body.email}
      ]
    };
    const dublicate = {
      name: 'MongoError',
      statuscode: 409
    };
    const defaultAvatar = {
      owner: 'default',
      url: "src/img/default-profile-image.png"
    };
    const user = new User;
    user.username = req.body.username;
    user.email = req.body.email;
    user.name = req.body.name;
    user.phone = "Set your phone number";
    user.avatar = defaultAvatar;
    user.events = [];
    user.notifications = [];
    user.chats = [];
    const password = req.body.password;
    datareader(User, params, 'findOne')
      .then((response) =>{
        if (response !== null){
          res.json(dublicate);
        } else {
          bcrypt.hash(password, 10, function(err, hash){
            if (err) res.json(err);
            else {
              user.password = hash;
              user.save(err => {
                if (err) res.json(err)
                else res.json({message: "Created"}).status(201)
              })
            }
          })
        }
      })
  });


  module.exports = router;