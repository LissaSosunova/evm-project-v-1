const router = require('express').Router();
const jwt = require('jwt-simple');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const datareader = require('../../modules/datareader');

router.post('/change_password_auth', async (req, res, next) => {
    /**
     * req.body = {
     *  oldPassword: string;
     *  newPassword: string;
     * }
     */
    let auth;
    if(!req.headers['authorization']) {
        return res.sendStatus(401)
    }
    try {
        auth = jwt.decode(req.headers['authorization'], req.headers['token_key']);
    } catch (err) {
        return res.sendStatus(401)
    }

    const authParams = {
        $or: [
            {username: auth.username},
            {email: auth.username}
        ]
    };
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    try {
        const user = await datareader(User, authParams, 'findWithPassword');
        bcrypt.compare(oldPassword, user.password, (err, valid) => {
            if (err) {
                console.error('error in bcrypt.compare', err);
                return res.status(500);
            } else if(!valid) {
                return res.json({message: 'Incorrect password'});
            } else {
                bcrypt.hash(newPassword, 10, async (err, hash) => {
                    if (err) {
                        console.error('error in bcrypt hash', err);
                        return res.status(500);
                    } else {
                        await datareader(User, {query: authParams, objNew: {password: hash}}, 'updateOne');
                        return res.json({message: 'password was changed', status: 200});
                    }
                }) 
            }
        });
    } catch(error) {
        console.error('change_password_auth', error);
        res.status(500);
    }

});

module.exports = router;

/**
 * res.json = {
 *  message: string;
 * }
 */