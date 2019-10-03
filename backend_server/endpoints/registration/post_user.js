const router = require('express').Router() // импортируем роутер

// импортируем модуль bcrypt для шифрования паролей (мы же не собираемся хранить их в БД в открытом виде?)
const bcrypt = require('bcrypt');
// импортируем JWT для декодирования web-token'ов
const jwt = require('jwt-simple');
// импортируем модель пользователя и евента
const User = require('../../models/user');
// схема для поиска контактов в БД
const datareader = require('../../modules/datareader');

const ConfUser = require('../../models/pending_registration_user');

// импортируем файл конфигурации (баловство, конечно, надо генерировать это на лету и хранить где-нибудь)
const config = require('../../config');
const transporter = require('../../modules/transporterNodemailer');

  /**
   * При поступлении запроса типа POST эта функция шифрует пароль с помощью bcrypt и сохраняет результат в БД.
   * При любых ошибках выдает статус 500 - Internal Server Error
   * 409 Conflict («конфликт») - при попытке добать юзера с уже существуещим емейлом или username
   * При удаче - возвращает 201
   */

  router.post('/user', async (req, res, next) => {

    const params = {
      $or: [
        {username: req.body.username},
        {email: req.body.email}
      ]
    };
    const dublicate = {
      message: 'MongoError',
      status: 409
    };
    const defaultAvatar = {
      owner: 'default',
      url: "assets/img/default-profile-image.png"
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
    try {
      const response = await datareader(User, params, 'findOne');
      const responseConfUser = await datareader(ConfUser, params, 'findOne');
      if (response !== null || responseConfUser !== null){
        res.json(dublicate);
      } else if (!config.confirmEmail) {
        bcrypt.hash(password, 10, function(err, hash){
          if (err) res.json(err);
          else {
            user.password = hash;
            user.save(err => {
              if (err) res.json(err)
              else res.json({status: 201, message: "Created"}).status(201)
            })
          }
        })
      } else {
        const token = jwt.encode({username: user.username}, config.secretkeyForEmail);
        const url = `${config.backendDomain}/confirm_email/${token}`;
        await transporter.sendMail({
          from: 'event-messenger',
          to: user.email,
          subject: "Email confirmation ✔",
          text: "Please, confirm your email",
          html: `Please click this link to confirm your email: <a href="${url}">${url}</a>
                <br> This link is valid during 10 minutes`
        });
        const confUser = new ConfUser;
        confUser.username = req.body.username;
        confUser.email = req.body.email;
        confUser.name = req.body.name;
        bcrypt.hash(password, 10, async (err, hash) => {
          if (err) res.json(err);
          else {
            confUser.password = hash;
            await datareader(confUser, null, 'save');
            res.json({status: 200, message: 'Email sent'});
          }
        }); 
    }

    }
    catch (err) {
      console.error('/user', err);
      res.sendStatus(500);
    }
    
  });


  module.exports = router;
