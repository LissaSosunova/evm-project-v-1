const router = require('express').Router() // импортируем роутер
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
        return res.sendStatus(200);
      })
  });

module.exports = router;