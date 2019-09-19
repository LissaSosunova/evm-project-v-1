const router = require('express').Router();
const User = require('../../models/user');
const fs = require('fs');
const datareader = require('../../modules/datareader');
const jwt = require('jwt-simple');
const path = require('path');


router.post('/delete_avatar', async function (req, res, next) {
	let auth;
      if(!req.headers['authorization']) {
      return res.sendStatus(401)
    }
    try {
      auth = jwt.decode(req.headers['authorization'], req.headers['token_key']);
    } catch (err) {
      return res.sendStatus(401)
    }
    const params = {
      $or: [
        {username: auth.username},
        {email: auth.username}
      ]
    };

  const userId = req.body.userId;
    

  const avatarObjToSave = {
		owner: 'default',
		url: `assets/img/default-profile-image.png`
	};
	const queryParam = {
		query: params,
		objNew: {$set: {avatar : avatarObjToSave}}
	};

	const updateAvatarInContacts = {
		query: { "contacts.id":userId},
		objNew: {
			$set : { "contacts.$.avatar" : avatarObjToSave }
		}
	};
	const updateAvatarInChats = {
		query: {"chats.id":userId},
		objNew: {
			$set : { "chats.$.avatar" : avatarObjToSave }
		}
	};

    try {
    	await datareader(User, queryParam, 'updateOne');
    	await datareader(User, updateAvatarInContacts, 'updateMany');
		await datareader(User, updateAvatarInChats, 'updateMany');
			// fs.readdir(path.join(__dirname,`../../uploads/${userId}/avatars/`), (err, items) => {
			// 	items.forEach((file) => {
			// 	fs.unlinkSync(path.join(__dirname,`../../uploads/${userId}/avatars/${file}`))
			// 	})
			// });
    	res.json(avatarObjToSave);
    } catch (err) {
    	console.error('/delete_avatar', err);
      	res.sendStatus(500);
    }

})

module.exports = router;
