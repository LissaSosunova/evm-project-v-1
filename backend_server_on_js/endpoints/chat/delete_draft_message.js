const router = require('express').Router()
const jwt = require('jwt-simple');
const Chat = require('../../models/chats');
const datareader = require('../../modules/datareader');

router.post('/delete_draft_message', async function (req, res, next){
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
 * }
 */
  const reqObj = req.body;
  const deleteDraftMessParams = {
    query: {"_id" : reqObj.chatID},
    objNew: {$pull:{draftMessages:{authorId: reqObj.authorId}}}
  };
  try {
    await datareader(Chat, deleteDraftMessParams, 'updateOne');
    res.json({status: 200, message: 'message was deleted'});
  } catch (err) {
    res.sendStatus(500);
  }
   
});

module.exports = router;