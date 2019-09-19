const router = require('express').Router();
const jwt = require('jwt-simple');
const transporter = require('../../modules/transporterNodemailer');
const config = require('../../config');

router.post('/change_email', async (req, res, next) => {
    const username = req.body.username;
    const newEmail = req.body.newEmail;
    let auth;
    if(!req.headers['authorization']) {
      return res.sendStatus(401)
    }
    try {
      auth = jwt.decode(req.headers['authorization'], req.headers['token_key']);
      const token = jwt.encode(username, config.secretkeyForEmail);
      const newEmailEncoded = jwt.encode(newEmail, config.secretkeyForEmail);
      const tokenTime = Date.now();
      const url = `${config.backendDomain}/confirm_change_email/${token}/${newEmailEncoded}/${tokenTime}`;

      await transporter.sendMail({
        from: 'event-messenger',
        to: newEmail,
        subject: "Change email confirmation ✔",
        text: "Please, confirm your email",
        html: `Please click this link to confirm changing your email: <a href="${url}">${url}</a>
              <br> This link is valid during 10 minutes`
      });

      res.json({status: 200, message: 'Email sent'});
      
    } catch (err) {
      return res.sendStatus(401)
    }

});

module.exports = router;
