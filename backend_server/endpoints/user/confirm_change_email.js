const router = require('express').Router();
const jwt = require('jwt-simple');
const datareader = require('../../modules/datareader');
const User = require('../../models/user');
const Chat = require('../../models/chats');
const config = require('../../config');

router.get('/confirm_change_email/:token/:email/:tokenTime', async (req, res, next) => {

    const token = req.params.token;
    const newEmail = req.params.email;
    const tokenTime = +req.params.tokenTime;
    const dateNow = Date.now();
    if (dateNow - tokenTime > config.expireChangeEmailLink) {
        res.json({message: 'Invalid link', status: 403});
    } else {
        const username = jwt.decode(token, config.secretkeyForEmail);
        try {
            const userInDb = await datareader(User, {username}, 'findOne');
            if (userInDb) {
                const newEmailDecoded = jwt.decode(newEmail, config.secretkeyForEmail);
                const paramsForEmailUpdate = {
                    query: {username},
                    objNew: {$set:{email: newEmailDecoded}}
                }
                await datareader(User, paramsForEmailUpdate, 'updateOne');
                const paramsForEmailUpdateInContacts = {
                    query: {
                        "contacts.id": username,
                    },
                    objNew: {
                        $set: {
                            "contacts.$.email": newEmailDecoded
                        }
                    }
                };
                await datareader(User, paramsForEmailUpdateInContacts, 'updateMany');
                const paramsForEmailUpdateInChats = {
                    query: {
                        "users.username": username
                    },
                    objNew: {
                        $set: {
                            "users.$.email": newEmailDecoded
                        }
                    }
                };
                await datareader(Chat, paramsForEmailUpdateInChats, 'updateMany');
                res.json({message: 'Email was updated', status: 200});
                // res.redirect(`${config.frontendDomain}/......`);
            } else {
                return res.json({message: 'User is not found'})
            }
        } catch(err) {
            console.error('confirm_change_email', err);
        }
    }

});

module.exports = router;
