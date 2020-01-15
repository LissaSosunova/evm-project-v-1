import * as express from 'express';
import * as core from 'express-serve-static-core';
import * as bodyParser from 'body-parser';
import {settings} from './config';
import {Login} from './endpoints/login/login'
import { DeleteChat } from './endpoints/chat/delete_chat';
import { Server } from 'socket.io';
import { runWebsocketsIO } from './sockets/socket.io';
import { DeleteDraftMessage } from './endpoints/chat/delete_draft_message';
import { GetDraftMessage } from './endpoints/chat/get_draft_message';
import { NewPrivateChat } from './endpoints/chat/new_private_chat';
import { PrivateChat } from './endpoints/chat/private_chat';
import { RenewChat } from './endpoints/chat/renew_chat';
import { SetDraftMessage } from './endpoints/chat/set_draft_message';
import { ChangeStatus } from './endpoints/events/change_status';
import { GetEvent } from './endpoints/events/event';
import { ChangePassword } from './endpoints/registration/change_password';
import { ForgotPassword } from './endpoints/registration/forgot_password';
import { PostUser } from './endpoints/registration/post_user';
import { ResetPassword } from './endpoints/registration/reset_password';
import { Account } from './endpoints/user/account';
import { ChangeEmail } from './endpoints/user/change_email';
import { ChangePasswordAuth } from './endpoints/user/change_password_auth';
import { ConfirmChangeEmail } from './endpoints/user/confirm_change_email';
import { DeleteContact } from './endpoints/user/delete_contacts';
import { FindUser } from './endpoints/user/find_user';
import { GetUser } from './endpoints/user/get_user';
import { Profile } from './endpoints/user/profile';
import { UploadAvatar } from './endpoints/user/upload_avatar';
import { DeleteAvatar } from './endpoints/user/delete_avatar';

const app: core.Express = express();
const port: string | number = process.env.PORT || settings.backendPort;

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization, token_key, userId');
  next();
});

app.route('/login')
    .post(new Login(express).router);

app.route('/delete_chat')
    .post(new DeleteChat(express).router);

app.route('/delete_draft_message')
  .post(new DeleteDraftMessage(express).router);

app.route('/get_draft_message/:id/')
    .get(new GetDraftMessage(express).router);

app.route('/new_private_chat')
  .post(new NewPrivateChat(express).router);

app.route('/private_chat/:id')
    .get(new PrivateChat(express).router);

app.route('/renew_chat')
    .post(new RenewChat(express).router);

app.route('/set_draft_message')
    .post(new SetDraftMessage(express).router);

app.route('/change_status')
    .post(new ChangeStatus(express).router);

app.route('/event/:id/')
    .post(new GetEvent(express).router);

app.route('/change_password')
    .post(new ChangePassword(express).router);

app.route('/forgot_password')
    .post(new ForgotPassword(express).router);

app.route('/user')
    .post(new PostUser(express).router);

app.route('/reset_password/:token/:tokenTime')
    .get(new ResetPassword(express).router);

app.route('/account')
    .get(new Account(express).router);

app.route('/change_email')
    .post(new ChangeEmail(express).router);

app.route('/change_password_auth')
    .post(new ChangePasswordAuth(express).router); 

app.route('/confirm_change_email/:token/:email/:tokenTime')
    .get(new ConfirmChangeEmail(express).router); 

app.route('/delete_avatar')
    .post(new DeleteAvatar(express).router);

app.route('/delete_contact')
    .post(new DeleteContact(express).router);

app.route('/find_user')
    .post(new FindUser(express).router);

app.route('/user')
    .get(new GetUser(express).router);

app.route('/profile')
    .post(new Profile(express).router);

app.route('/upload_avatar')
    .post(new UploadAvatar(express).router);

const server = app.listen(port);
runWebsocketsIO(server);
console.log(`Backend server is listening on port ${port}`);
