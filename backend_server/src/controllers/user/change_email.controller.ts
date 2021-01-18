import { Request, Response } from 'express';
import { AuthToken } from '../../abstract_classes/auth_abstract';
import { Auth, ChangeEmailReq, Server200Response } from '../../interfaces/types';
import * as jwt from 'jwt-simple';
import { settings as config} from '../../config';
import { transporter } from '../../modules/transporterNodemailer';

export class ChangeEmailController extends AuthToken {

    public async changeEmail(req: Request, res: Response): Promise<Response> {
        const reqObj: ChangeEmailReq = req.body;
            const {newEmail} = reqObj;
            const auth: Auth = this.checkToken(req);
            const {username} = auth;
            try {
              const token: string = jwt.encode(username, config.secretkeyForEmail);
              const newEmailEncoded: string = jwt.encode(newEmail, config.secretkeyForEmail);
              const tokenTime: number = Date.now();
              const url = `${config.backendDomain}/api/${config.version}/user/confirm_change_email/${token}/${newEmailEncoded}/${tokenTime}`;
              await transporter.sendMail({
                from: 'event-messenger',
                to: newEmail,
                subject: 'Change email confirmation ✔',
                text: 'Please, confirm your email',
                html: `Please click this link to confirm changing your email: <a href="${url}">${url}</a>
                      <br> This link is valid during 10 minutes`
              });
              return res.json({status: 200, message: 'Email sent'} as Server200Response);
            } catch (error) {
              console.error('/change_email', error);
              return res.status(500).json({error, status: 500});
            }
    }
}