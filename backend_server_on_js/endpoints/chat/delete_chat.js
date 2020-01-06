const router = require('express').Router()
const jwt = require('jwt-simple');
const config = require('../../config');
const User = require('../../models/user');
const datareader = require('../../modules/datareader');


router.post('/delete_chat/', async function (req, res, next) {
    let auth;
    if(!req.headers['authorization']) {
      return res.sendStatus(401)
    }
    try {
      auth = jwt.decode(req.headers['authorization'], req.headers['token_key']);
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
      const updateRes = await datareader(User, params, 'updateOne');
    } catch (err) {
      return res.sendStatus(500)
    }
    res.sendStatus(200);
  })

  module.exports = router;
