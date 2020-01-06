const router = require('express').Router();
const User = require('../../models/user');
const datareader = require('../../modules/datareader');
const jwt = require('jwt-simple');
const config = require('../../config');

router.get('/reset_password/:token/:tokenTime', async (req, res, next) => {

    const token = req.params.token;
    const tokenTime = +req.params.tokenTime;
    const dateNow = Date.now();
    if (dateNow - tokenTime > config.expireResetPasswordLink) {
        res.json({message: 'Invalid link', status: 403});
    } else {
        const username = jwt.decode(token, config.secretkeyForPasswordReset);
        try {
            const user = await datareader(User, {username}, 'findOne');
            if(user === null) {
                res.json({message: 'User is not found', status: 404});
            } else {
                res.redirect(`${config.frontendDomain}/reset-password/${token}/${tokenTime}`);
            }
        } catch(err) {
            console.error('/reset_password', err);
        }
    } 

});

module.exports = router;
