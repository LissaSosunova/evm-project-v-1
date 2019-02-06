const router = require('express').Router()
const jwt = require('jwt-simple');
const config = require('./config');
const User = require('./models/user');
const Chat = require('./models/chats');
const datareader = require('./datareader');

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
  const params = req.params.id;
  let auth;
  try {
    auth = jwt.decode(req.headers['authorization'], config.secretkey);
  } catch (err) {
    return res.sendStatus(401)
  }
  try {
    const getUserChat = await datareader(Chat, params, 'findById');
    res.json(getUserChat);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.post('/new_private_chat/', function (req, res, next) {
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
  let chat = new Chat;
  chat.users = req.body.users;
  chat.email = req.body.email;
  chat.messages = [];
  chat.type = "private";
  chat.save(err => {
    if (err) { 
      res.json(err);
      }
    else {
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