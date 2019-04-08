const router = require('express').Router()
const jwt = require('jwt-simple');
const config = require('../../config');
const Chat = require('../../models/chats');
const datareader = require('../../modules/datareader');
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
      auth = jwt.decode(req.headers['authorization'], req.headers['token_key']);
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

  module.exports = router;