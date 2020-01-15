const router = require('express').Router();
const User = require('../../models/user');
const datareader = require('../../modules/datareader');
const transporter = require('../../modules/transporterNodemailer');
const jwt = require('jwt-simple');
const config = require('../../config');

router.post('/forgot_password', async (req, res, next) => {

    const email = req.body.email;
    try {
        const emailInDb = await datareader(User, {email}, 'findOne');
        if(emailInDb == null) {
            res.json({message: 'Email is not found', status: 404});
        } else {
            const token = jwt.encode(emailInDb.username, config.secretkeyForPasswordReset);
            const tokenTime = Date.now();
            const url = `${config.backendDomain}/reset_password/${token}/${tokenTime}`;

                await transporter.sendMail({
                    from: 'event-messenger',
                    to: email,
                    subject: "Forgot password",
                    text: "Reset password",
                    html: `Please click this link to reset your password: <a href="${url}">${url}</a>
                            <br> This link is valid during 10 minutes`
                });
                res.json({message: 'Email was sent', status: 200});
        }
    }

    catch (err) {
        console.error('/forgot_password', err);
    } 

});

module.exports = router;
