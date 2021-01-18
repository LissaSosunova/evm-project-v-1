import { Request, Response } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Avatar, PendingRegUser, Server200Response } from '../../interfaces/types';
import { ConfUser } from '../../models/pending_registration_user';
import { User } from '../../models/user';
import { datareader } from '../../modules/datareader';
import { transporter } from '../../modules/transporterNodemailer';
import * as jwt from 'jwt-simple';
import * as bcrypt from 'bcrypt';
import { settings as config} from '../../config';

export class NewUserController {

    public async user(req: Request, res: Response): Promise<void> {
        const reqObj: PendingRegUser = req.body;
        const params = {
          $or: [
            {username: reqObj.username},
            {email: reqObj.email}
          ]
        };
        const dublicate: Server200Response = {
          message: 'MongoError',
          status: 409
        };
        const defaultAvatar: Avatar = {
          owner: 'default',
          url: 'assets/img/default-profile-image.png'
        };
        const user = new User;
        user.username = reqObj.username;
        user.email = reqObj.email;
        user.name = reqObj.name;
        user.phone = 'Set your phone number';
        user.avatar = defaultAvatar;
        user.events = [];
        user.notifications = [];
        user.chats = [];
        const password = reqObj.password;
        try {
          const response = await datareader(User, params, MongoActions.FIND_ONE);
          const responseConfUser = await datareader(ConfUser, params, MongoActions.FIND_ONE);
          if (response !== null || responseConfUser !== null) {
            res.json(dublicate);
          } else if (!config.confirmEmail) {
            bcrypt.hash(password, 10, function(err, hash) {
              if (err) {
                res.json(err);
              } else {
                user.password = hash;
                user.save(error => {
                  if (error) {
                    res.json(error);
                  } else {
                    res.status(201).json({status: 201, message: 'Created'} as Server200Response);
                  }
                });
              }
            });
          } else {
            const token = jwt.encode({username: user.username}, config.secretkeyForEmail);
            const url = `${config.backendDomain}/api/${config.version}/confirm_email/${token}`;
            await transporter.sendMail({
              from: 'event-messenger',
              to: user.email,
              subject: 'Email confirmation ✔',
              text: 'Please, confirm your email',
              html: `Please click this link to confirm your email: <a href="${url}">${url}</a>
                    <br> This link is valid during 10 minutes`
            });
            const confUser = new ConfUser;
            confUser.username = reqObj.username;
            confUser.email = reqObj.email;
            confUser.name = reqObj.name;
            bcrypt.hash(password, 10, async (err, hash) => {
              if (err) {
                res.json(err);
              } else {
                confUser.password = hash;
                await datareader(confUser as any, null, MongoActions.SAVE);
                res.json({status: 200, message: 'Email sent'} as Server200Response);
              }
            });
        }
        } catch (error) {
          console.error('/user', error);
          res.status(500).json({error, status: 500});
        }
    }
}