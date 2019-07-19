const nodemailer = require('nodemailer');
const creds = require('../credsEmail');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: creds.email,
      pass: creds.password
    }
  });

module.exports = transporter; 