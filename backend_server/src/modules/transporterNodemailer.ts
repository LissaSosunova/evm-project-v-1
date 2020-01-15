import * as nodemailer from 'nodemailer';
import {creds} from '../credsEmail';
import Mail = require('nodemailer/lib/mailer');

export const transporter: Mail = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: creds.email,
      pass: creds.password
    } 
})
