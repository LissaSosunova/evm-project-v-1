const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 5006;
const $login = require('./endpoints/login/login');
const $account = require('./endpoints/user/account');
const $event = require('./endpoints/events/event');
const $newEvent = require('./endpoints/events/new_event');
const $changeStatus = require('./endpoints/events/change_status');
const $postUser = require('./endpoints/registration/post_user');
const $getUser = require('./endpoints/user/get_user');
const $findUser = require('./endpoints/user/find_user');
const $addUser = require('./endpoints/user/add_user');
const $confirmUser = require('./endpoints/user/confirm_user');
const $deleteContact = require('./endpoints/user/delete_contact');
const $privateChat = require('./endpoints/chat/private_chat');
const $sendMessage = require('./endpoints/chat/send_message');
const $newPrivateChat = require('./endpoints/chat/new_private_chat');
const $deleteChat = require('./endpoints/chat/delete_chat');
const $renewChat = require('./endpoints/chat/renew_chat');
const $setDraftMessage = require('./endpoints/chat/set_draft_message');
const $deleteDraftMessage = require('./endpoints/chat/delete_draft_message');
const $getDraftMessage = require('./endpoints/chat/get_draft_message');
const socketIO = require('./sockets/socket.io');

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization, token_key');
  next();
});

app.route('/profile')
  .post($postUser);

app.route('/event/:id/')
  .get($event);

app.route('/new_event')
  .post($newEvent);

app.route('/user')
  .post($postUser);

app.route('/user')
  .get($getUser);

app.route('/find_user')
  .post($findUser);

app.route('/add_user')
  .post($addUser);

app.route('/confirm_user')
  .post($confirmUser);

app.route('/delete_contact')
  .post($deleteContact);

app.route('/delete_chat')
  .post($deleteChat);

app.route('/renew_chat')
  .post($renewChat);

app.route('/login')
  .post($login);

app.route('/account')
  .get($account);

app.route('/change_status/')
  .post($changeStatus);

app.route('/private_chat/:id/')
   .get($privateChat);

app.route('/new_private_chat/')
  .post($newPrivateChat);

app.route('/send_message')
  .post($sendMessage);

app.route('/set_draft_message')  
  .post($setDraftMessage);

app.route('/delete_draft_message')
  .post($deleteDraftMessage);

app.route('/get_draft_message/:id/')  
  .get($getDraftMessage);

const server = app.listen(port); 
 console.info('Backend server listening on port ' + port);

socketIO(server, app);

module.exports = { app };
