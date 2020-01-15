const router = require('express').Router()
const jwt = require('jwt-simple');
const Chat = require('../../models/chats');
const datareader = require('../../modules/datareader');
const url = require('url');
const queryString = require('querystring');

router.get('/get_draft_message/:id/', async function (req, res, next){
  if(!req.headers['authorization']) {
    return res.sendStatus(401)
  }
  let auth;
  try {
    auth = jwt.decode(req.headers['authorization'], req.headers['token_key']);
  } catch (err) {
    return res.sendStatus(401)
  }
    const chatId = req.params.id;
    const queryParam = url.parse(req.url).query;
    const authorId = queryString.parse(queryParam).authorId;
    const queryParams = {
        query: {_id : chatId},
        elementMatch: {draftMessages: {$elemMatch: {authorId: authorId}}}
    }
  try {
    const result = await datareader(Chat, queryParams, 'findElementMatch');
    res.json(result[0]);
  } catch (err) {
    res.sendStatus(500);
  }
   
});

module.exports = router;