const router = require('express').Router()
const jwt = require('jwt-simple');
const config = require('../../config');
const User = require('../../models/user');
const Chat = require('../../models/chats');
const datareader = require('../../modules/datareader');

router.post('/renew_chat', async function(req, res, next) {
    let auth;
    let chatId;
    if(!req.headers['authorization']) {
      return res.sendStatus(401)
    }
    try {
      auth = jwt.decode(req.headers['authorization'], req.headers['token_key']);
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
    } catch (err) {
      res.sendStatus(500);
    }
    const response = {
      chatId: chatId[0]._id
    };
    res.json(response);
  })

  module.exports = router;
