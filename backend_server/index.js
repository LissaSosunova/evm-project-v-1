const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const port = 5006;
const $user = require('./user');
const $login = require('./login');
const $account = require('./account');
const $event = require('./event');
const $chat = require('./chat');
const webSocketServer = require('./websockets');
// const server = http.createServer(app);
const socketIO = require('./socket.io');

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

app.route('/profile')
  .post($user);

app.route('/event/:id/')
  .get($event);

app.route('/new_event')
  .post($event);

app.route('/user')
  .post($user);

app.route('/user')
  .get($user);

app.route('/finduser')
  .post($user);

app.route('/adduser')
  .post($user);

app.route('/confirmuser')
  .post($user);

app.route('/deleteContact')
  .post($user);

app.route('/deleteChat')
  .post($chat);

app.route('/renew_chat')
  .post($chat);

app.route('/login')
  .post($login);

app.route('/account')
  .get($account);

app.route('/change_status/')
  .post($event);

app.route('/private_chat/:id/')
   .get($chat);

app.route('/new_private_chat/')
  .post($chat);

const server = app.listen(port); 
 console.info('Backend server listening on port ' + port);

socketIO(server, app);
// webSocketServer();

module.exports = { app };
