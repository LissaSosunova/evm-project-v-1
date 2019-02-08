const router = require('express').Router()
const jwt = require('jwt-simple');
const config = require('./config');
const User = require('./models/user');
const Chat = require('./models/chats');
const datareader = require('./datareader');
const url = require('url');
const queryString = require('querystring');

class ChatData {
  constructor(chat) {
    this.id = chat._id;
    this.users = chat.users;
    this.email = chat.email;
    this.messages = chat.messages;
  }
}

router.get('/private_chat/:id/', async function (req, res, next){
  if(!req.headers['authorization']) {
    return res.sendStatus(401)
  }
  let auth;
  try {
    auth = jwt.decode(req.headers['authorization'], config.secretkey);
  } catch (err) {
    return res.sendStatus(401)
  }
  try {
    const chatId = req.params.id;
    const param = url.parse(req.url).query;
    const mesAmount = 20;
    const queryNum = +queryString.parse(param).queryNum;
    const n = queryNum * mesAmount; 
    const getChatParams = {
      query: {_id: chatId},
      elementMatch: {messages: {$slice: [n, mesAmount]}}
    };
    const getUserChat = await datareader(Chat, getChatParams, 'findOneElementMatch');
    res.json(getUserChat.messages);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.post('/new_private_chat/', async function (req, res, next) {
  let auth;
  if(!req.headers['authorization']) {
    return res.sendStatus(401)
  };
  try {
    auth = jwt.decode(req.headers['authorization'], config.secretkey);
  } catch (err) {
    return res.sendStatus(401)
  };
  const params = {
    $or: [
      {username: auth.username},
      {email: auth.username}
    ]
  };
  const findChatParams = {
    $and:[{users: req.body.users[0]}, {users: req.body.users[1]}]
  };
  // req.body.users[0] - пусть это будет мой id, а req.body.users[1] - id того, кому пишу
  // как по мне, то это немного костыльно
  try {
    // Добавим проверку, существует ли такой чат в базе
    // Если его нет, то создаём новый чат
    // Если существует, то возвращаем сообщение об этом и id чата
    const findChat = await datareader(Chat, findChatParams, 'findOne');
    if (findChat == null) {
      const chat = new Chat;
      chat.users = req.body.users;
      chat.email = req.body.email;
      chat.messages = [];
      chat.type = "private";
      const chatItem = {};
        const response = await datareader(User, {username: req.body.users[1]}, 'findOne');
        chatItem.id = req.body.users[1];
        chatItem.name = response.name;
        chatItem.avatar = response.avatar;
        chatItem.chatId = chat.id
        const updateParams = {
          query: params, 
          objNew:  {$push: {chats: chatItem}}};
        const updateChat = await datareader(User, updateParams, 'updateOne');
      chat.save((err, data) => {
        if (err) { 
          res.json(err);
          }
        else {
          console.log('chat was saved', data);
          let createdChat = new ChatData(chat);
          datareader(User, params, 'findOne')
           .then(response => {
            let user1 = '', user2 = '';
            for (let i=0; i<chat.users.length;i++) {
              user1 = chat.users[0];
              user2 = chat.users[1];
            }
            const updateUser1Params = {
              query: {"username" : user1, "contacts.id" : user2},
              objNew: {$set : { "contacts.$.private_chat" : createdChat.id }}
            };
            datareader(User, updateUser1Params, 'updateOne');
            const updateUser2Params = {
              query: {"username" : user2, "contacts.id" : user1},
              objNew: {$set : { "contacts.$.private_chat" : createdChat.id }}
            };
            datareader(User, updateUser2Params, 'updateOne');
            })
            .then(response => {
              res.json(createdChat);
            })
        }
      })
    } else {
      res.json({message: "Exists", chatId: findChat._id});
    }

  } catch (err) {
    res.sendStatus(500);
  }

});

router.post('/deleteChat/', async function (req, res, next) {
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
  const deleteChatParams = {
    query: {"username" : dataObj.myId, "contacts.id" : dataObj.contactId},
    objNew:{$set : { "contacts.$.private_chat" : '-1' }}
  };
  const params = {
    query: {username: dataObj.myId},
    objNew: {$pull: {chats: {id: dataObj.contactId}}}
  };
  try {
    const deleteChat = await datareader(User, deleteChatParams, 'updateOne');
    console.log('deleteChat', deleteChat);
    const updateRes = await datareader(User, params, 'updateOne');
    console.log('updateRes', updateRes);
  } catch (err) {
    return res.sendStatus(500)
  }
  res.sendStatus(200);
})

router.post('/renew_chat', async function(req, res, next) {
  let auth;
  let chatId;
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
    query: {$and:[{users: dataObj.myId}, {users: dataObj.contactId}]},
    elementMatch: {_id: 1}
  };
  try {
    chatId = await datareader(Chat, params, 'findElementMatch');
    const renewChatParams = {
      query: {"username" : dataObj.myId, "contacts.id" : dataObj.contactId},
      objNew:{$set : { "contacts.$.private_chat" : chatId[0]._id }}
      // возвращаем id чата в документ
    };
    const renewChat = await datareader(User, renewChatParams, 'updateOne');
    console.log(renewChat);
  } catch (err) {
    res.sendStatus(500);
  }
  const response = {
    chatId: chatId[0]._id
  };
  res.json(response);
})

module.exports = router;