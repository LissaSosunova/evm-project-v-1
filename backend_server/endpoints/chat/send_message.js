const router = require('express').Router()
const jwt = require('jwt-simple');
const Chat = require('../../models/chats');
const datareader = require('../../modules/datareader');

router.post('/send_message', async function (req, res, next){
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
        const message = {};
        message.chatID = req.body.chatID;
        message.authorId = req.body.authorId;
        message.text = req.body.text;
        message.edited = req.body.edited;
        message.date = req.body.date;

      const getChatParams = {_id: message.chatID};

      const updateParams = {
        getChatParams,
        objNew:  {$push: {messages: message}}};

        const updateChat = await datareader(Chat, updateParams, 'updateOne');

    // Return updated chat
        const returnUpdatedChat = await  datareader(Chat, getChatParams, 'findOne')
            .then((response => {
              res.json(response);
            }));
        } catch (err) {
          console.error(err);
          res.sendStatus(500);
        }
      });

  module.exports = router;