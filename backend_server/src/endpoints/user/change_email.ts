import * as jwt from 'jwt-simple';
import * as express from 'express';
import { Router } from 'express';
import { transporter } from '../../modules/transporterNodemailer';
import { settings as config} from '../../config';
import { ChangeEmailReq, Server200Response, Auth } from '../../interfaces/types';

export class ChangeEmail {

    public router: Router;
    constructor(private express) {
        this.init();
    }

    private init(): void {
        this.router = this.express.Router();
        this.router.post('/change_email', async (req, res, next) => {
            const reqObj: ChangeEmailReq = req.body;
            const {username, newEmail} = reqObj;
            let auth: Auth;
            if (!req.headers['authorization']) {
              return res.sendStatus(401);
            }
            try {
              auth = jwt.decode(req.headers['authorization'], req.headers['token_key'] as string);
              const token: string = jwt.encode(username, config.secretkeyForEmail);
              const newEmailEncoded: string = jwt.encode(newEmail, config.secretkeyForEmail);
              const tokenTime: number = Date.now();
              const url = `${config.backendDomain}/confirm_change_email/${token}/${newEmailEncoded}/${tokenTime}`;
              await transporter.sendMail({
                from: 'event-messenger',
                to: newEmail,
                subject: 'Change email confirmation ✔',
                text: 'Please, confirm your email',
                html: `Please click this link to confirm changing your email: <a href="${url}">${url}</a>
                      <br> This link is valid during 10 minutes`
              });
              res.json({status: 200, message: 'Email sent'} as Server200Response);
            } catch (error) {
              console.error('/change_email', error);
              return res.status(500).json({error, status: 500});
            }
        });
    }
}
