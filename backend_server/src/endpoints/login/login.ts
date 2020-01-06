import * as bcrypt from 'bcrypt';
import * as jwt from 'jwt-simple';
import {User} from '../../models/user';
import * as crypto from 'crypto';
import * as express from 'express';
import { Router } from 'express';
import { LoginResponse } from '../../interfaces/types';

export class Login {
    public router: Router;
    constructor(private express) {
        this.init();
    }

    private init(): void {
        this.router = this.express.Router();
        this.router.post('/login', (req, res, next) => {
            let username: string;
            let password: string;
            if (!req.body.username || !req.body.password) {
                return res.sendStatus(400);
            } else {
                username = req.body.username;
                password = req.body.password;
                User.findOne(
                  {
                    $or: [
                      {username: username},
                      {email: username}
                    ]
                  }
                   )
                .select('password')
                .exec((err, user) => {
                    if (err) {
                        return res.status(500).json({err});
                    }
                    if (!user) {
                      return res.json({message: 'Incorrect user'}).status(401);
                      }
                    bcrypt.compare(password, (user as any).password, (error, valid) => {
                    if (err) {
                      return res.status(500).json({error});
                    }
                    if (!valid) {
                      return res.json({message: 'Incorrect password'}).status(401);
                    }
                    const tokenKey: string = crypto.randomBytes(20).toString('hex');
                    const token: string = jwt.encode({username: username}, tokenKey);
                    res.json({success: true, access_token: token, token_key: tokenKey} as LoginResponse);
                  });
                });
            }
        });
    }
}
