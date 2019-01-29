const router = require('express').Router() // импортируем роутер

// импортируем модуль bcrypt для шифрования паролей (мы же не собираемся хранить их в БД в открытом виде?)
const bcrypt = require('bcrypt');
// плагин для аватрок
const multer = require('multer');
// импортируем JWT для декодирования web-token'ов
const jwt = require('jwt-simple');
// импортируем модель пользователя и евента
const User = require('./models/user');
const Event = require('./models/event');
const Avatar = require('./models/avatar');
const datareader = require('./datareader');

// импортируем файл конфигурации (баловство, конечно, надо генерировать это на лету и хранить где-нибудь)
const config = require('./config');

class SetAvatar {
  constructor(avatar) {
    this.owner = avatar.owner;
    this.data = avatar.data;
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

//Для контатов поле статуза имеет значение:
// status == 1 -- ПОДТВЕРДИЛИ ДОБАВЛЕНИЕ, status == 2 -- ЖДУТ ПОДТВЕРЖДЕНИЕ (от контакта, у которого в бд висит этот статус), status == 3 - ПРИГЛАШЕННЫЕ, НО НЕ ПОДТВЕРДИЛИ (контакт ждет, когда подтвердят добавление)

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

class FindContact {
  constructor(user) {
    this.id = user.username;
    this.email = user.email;
    this.name = user.name;
    this.avatar = user.avatar;
  }
}

/**
 * При поступлении запроса типа POST эта функция шифрует пароль с помощью bcrypt и сохраняет результат в БД.
 * При любых ошибках выдает статус 500 - Internal Server Error
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
    name: 'MongoError'
  };
  const defaultAvatar = {
    owner: 'default',
    url: "src/img/default-profile-image.png"
  };
  const user = new User;
  user.username = req.body.username;
  user.email = req.body.email;
  user.name = "No name";
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
              else res.sendStatus(201)
            })
          }
        })
      }
    })
});


/**
 * При поступлении запроса типа GET эта функция проверяет наличие заголовка типа X-Auth-Token, при его отсутствии
 * возвращает 401 - Unauthorized. При наличии расшифровывает токен, содержащийся в заголовке с помощью jwt,
 * затем ищет пользователя с оным именем в базе данных.
 * При любых ошибках возвращает JSON объекта error
 * При успехе возвращает JSON объекта user (без пароля, естественно)
 */


router.get('/user', function (req, res, next) {
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

  const servicePromise = datareader(User, params, 'findOne');
  servicePromise
        .then(response =>{
        const user = new UserData(response);
          res.json(user);
        })
});

router.post('/finduser', async function (req, res, next) {
  let auth;
  const query = req.body;
  try {
    auth = jwt.decode(req.headers['authorization'], config.secretkey);
  } catch (err) {
    return res.sendStatus(401)
  }
  const queryParam = {
    $or:[{username: {$regex: query}}, {email: {$regex: query}}]
  }
  try {
    const result = await datareader(User, queryParam, 'find');
    let resp = [];
    for (let i=0; i<result.length; i++){
      if(query != "" && auth.username !== result[i].username){
        resp.push(result[i]);
      }
    }
    res.json(resp);
  } catch (err) {
      res.sendStatus(500);
  }
});

router.post('/adduser', async function (req, res, next) {
  let auth;
  let exsistCont = false;
  const query = req.body;
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
    const result = await datareader(User, params, 'findOne');
    result.contacts.forEach(item => {
      if (query.id === auth.username || item.id === query.id ) {
        exsistCont = true;
        }
    });
    if (query.id === auth.username) exsistCont = true;
    if (exsistCont) return res.json({message: "This contact is already exists"});

    const findRes = await datareader(User, {username: query}, 'findOne');
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
    res.json(updateRes);
  } catch(err) {
    res.sendStatus(500);
  }
});

router.post('/confirmuser', async function (req, res, next) {
  let auth;
  const query = req.body;
  try {
    auth = jwt.decode(req.headers['authorization'], config.secretkey);
  } catch (err) {
    return res.sendStatus(401)
  }
  const params1 = {username: auth.username};
  const params2 = {username: query};

  datareader(User, params2, 'findOne')
    .then(response2 =>{
      User.updateOne({"username" : response2.username, "contacts.id": auth.username},
        {
          $set : { "contacts.$.status" : 1 }
        }, { upsert: true },
        function(err, result){
        }
      );
    });
  datareader(User, params1, 'findOne')
    .then(response1 =>{
      User.updateOne({"username" : response1.username, "contacts.id": query},
        {
          $set : { "contacts.$.status" : 1 }
        }, { upsert: true },
        function(err, result){
          console.log(result);
          res.sendStatus(200)
        }
      );
    })
});

router.post('/deleteContact', async function (req, res, next) {
  let auth;
  if(!req.headers['authorization']) {
    return res.sendStatus(401)
  }
  try {
    auth = jwt.decode(req.headers['authorization'], config.secretkey);
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

})

router.post('/profile', function (req, res, next){
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
  const editedData = req.body;
  datareader(User, params, 'findOne')
    .then(response =>{
      if (editedData.phone && response.phone !== editedData.phone){
        User.updateOne({"username" : response.username},
          {
            $set : { "phone" : editedData.phone }
          }, { upsert: true },
          function(err, result){
          }
        );
        return response;
      } return response;
    })
    .then(response =>{
      if (editedData.name && response.name !== editedData.name){
        User.updateOne({"username" : response.username},
          {
            $set : { "name" : editedData.name }
          }, { upsert: true },
          function(err, result){
          }
        );
        // update name in contacts arrs
        User.updateMany({"contacts.id": response.username},
          {
            $set : { "contacts.$.name" : editedData.name }
          }, { upsert: true },
          function(err, result){
          }
        );

        User.updateMany({"chats.id": response.username},
          {
            $set : { "chats.$.name" : editedData.name }
          }, { upsert: true },
          function(err, result){
          }
        );

        return response;
      }
    })
    .then(response =>{
      if (editedData.avatar){
        const avatar = new Avatar(editedData.avatar);
        User.updateOne({"username" : response.username},
          {
            $set : { "avatar" : avatar }
          }, { upsert: true },
          function(err, result){
          }
        );
        // update name in contacts arrs
        // User.updateMany({"contacts.id": response.username},
        //   {
        //     $set : { "contacts.$.name" : editedData.name }
        //   }, { upsert: true },
        //   function(err, result){
        //   }
        // );
        return response;
      }
    })
    .then(response =>{
      return res.json(response);
    })
});

module.exports = router;
