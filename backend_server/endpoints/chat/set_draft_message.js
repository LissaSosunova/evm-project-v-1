const router = require('express').Router()
const jwt = require('jwt-simple');
const Chat = require('../../models/chats');
const datareader = require('../../modules/datareader');

router.post('/set_draft_message', async function (req, res, next){
  if(!req.headers['authorization']) {
    return res.sendStatus(401)
  }
  let auth;
  try {
    auth = jwt.decode(req.headers['authorization'], req.headers['token_key']);
  } catch (err) {
    return res.sendStatus(401)
  }
/**
 * req.body = {
 *  chatID: String,
    authorId: String,
    text: String,
    date: Number
 * }
 */
  const reqObj = req.body;
  const deleteDraftMessParams = {
    query: {"_id" : reqObj.chatID},
    objNew: {$pull:{draftMessages:{authorId: reqObj.authorId}}}
  };
  const updateParams = {
    query: {"_id" : reqObj.chatID},
    objNew: {$push: {"draftMessages": reqObj}}
  };
  const queryParams = {
    _id: reqObj.chatID, "draftMessages.authorId": reqObj.authorId
  }
  try {
    const findDraftMes = await datareader(Chat, queryParams, 'findOne');
    if (findDraftMes == null) {
      await datareader(Chat, updateParams, 'updateOne');
    } else {
      await datareader(Chat, deleteDraftMessParams, 'updateOne');
      await datareader(Chat, updateParams, 'updateOne');
    }
    res.json({code: 200});
  } catch (err) {
    res.sendStatus(500);
  }
   
});

module.exports = router;