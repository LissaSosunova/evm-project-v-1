const router = require('express').Router();
const jwt = require('jwt-simple');
const datareader = require('../../modules/datareader');
const ConfUser = require('../../models/pending_registration_user');
const User = require('../../models/user');
const config = require('../../config');

router.get('/confirm_email/:token', async (req, res, next) => {


    try {
        const token = req.params.token;
        const auth = jwt.decode(token, config.secretkeyForEmail);
        const pendingUser = await datareader(ConfUser, auth, 'findOne');
        if (pendingUser == null) {
            res.json({message: "User is not found"});
        } else {
            const pendingUserPassword = await datareader(ConfUser, auth, 'findWithPassword');
            const defaultAvatar = {
                owner: 'default',
                url: "assets/img/default-profile-image.png"
            };
        
            const user = new User;
            user.username = pendingUser.username;
            user.password = pendingUserPassword.password;
            user.email = pendingUser.email;
            user.name = pendingUser.name;
            user.phone = "Set your phone number";
            user.avatar = defaultAvatar;
            user.events = [];
            user.notifications = [];
            user.chats = [];
            await datareader(user, null, 'save');
            await datareader(ConfUser, auth, 'deleteOne');
            res.redirect(`${config.frontendDomain}/email-confirmed`);}

    } catch (err) {
        console.error('/confirm_email', err);
        res.sendStatus(500);
    }

});

module.exports = router;