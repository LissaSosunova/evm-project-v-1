const router = require('express').Router();
const User = require('../../models/user');
const datareader = require('../../modules/datareader');
const jwt = require('jwt-simple');
const config = require('../../config');
const bcrypt = require('bcrypt');

router.post('/change_password', async (req, res, next) => {
    let username;
    try {
        username = jwt.decode(req.headers['authorization'], config.secretkeyForPasswordReset);
      } catch (err) {
        return res.sendStatus(401)
      }
    const tokenTime = +req.body.tokenTime;
    const dateNow = Date.now();
    if (dateNow - tokenTime > config.expireResetPasswordLink) {
        res.json({message: 'Invalid link', status: 403});
    } else {
        const newPassword = req.body.password;
        bcrypt.hash(newPassword, 10, async (err, hash) => {
            if (err) res.json(err);
            else {
                try {
                    await datareader(User, {query: {username}, objNew: {password: hash}}, 'updateOne');
                    res.json({message: 'Password changed', status: 200});
                } catch (err) {
                    console.error('/change_password', err);
                }
            }
        })
    }
});

module.exports = router;
