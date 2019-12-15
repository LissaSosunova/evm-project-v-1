const nodemailer = require('nodemailer');
const creds = require('../credsEmail');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    // service: "Gmail",
    auth: {
      user: creds.email,
      pass: creds.password
    }
  });

module.exports = transporter; 