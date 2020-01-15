const router = require('express').Router();
const User = require('../../models/user');
const multer = require('multer');
const fs = require('fs');
const datareader = require('../../modules/datareader');
const jwt = require('jwt-simple');
const path = require('path');
let fileName;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  	const userId = req.headers.userid;
  	const uploadPathRoot = `../../uploads`;
  	const uploadPathNested1 = `../../uploads/${userId}`;
  	const uploadPathNested2 = `../../uploads/${userId}/avatars`;
  	if (!fs.existsSync(path.join(__dirname, uploadPathRoot))) {
          fs.mkdirSync(path.join(__dirname, uploadPathRoot));
    }
    if (!fs.existsSync(path.join(__dirname, uploadPathNested1))) {
        fs.mkdirSync(path.join(__dirname, uploadPathNested1));
    }
    if (!fs.existsSync(path.join(__dirname, uploadPathNested2))) {
        fs.mkdirSync(path.join(__dirname, uploadPathNested2));
    }
    fs.readdir(path.join(__dirname,`../../uploads/${userId}/avatars/`), (err, items) => {
    	items.forEach((file) => {
    		fs.unlinkSync(path.join(__dirname,`../../uploads/${userId}/avatars/${file}`))
    	})
    });
    cb(null,  path.join(__dirname, uploadPathNested2));
  },
  filename: function (req, file, cb) {
  	fileName = file.fieldname + '-' + Date.now();
    cb(null, fileName)
  }
});

const fileFilter = function (req, file, cb) {
	const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
	if (allowedMimes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb({
			success: false,
			message: 'Invalid file type. Only jpg, png image files are allowed.'
		}, false);
	}
};

const upload = multer({ storage, fileFilter });


router.post('/upload_avatar', upload.single('image'), async function (req, res, next) {
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
	const img = fs.readFileSync(req.file.path);
	const encode_image = img.toString('base64');
 	
 	// BASE64 object
	const finalImg = {
      contentType: req.file.mimetype,
      image:  new Buffer(encode_image, 'base64')
	};

	const avatarObjToSave = {
		owner: req.headers.userid,
		avatar: finalImg
	};

	const queryParam = {
		query: params,
		objNew: {$set: {avatar : avatarObjToSave}}
	};
	const updateAvatarInContacts = {
		query: { "contacts.id":req.headers.userid},
		objNew: {
			$set : { "contacts.$.avatar" : avatarObjToSave }
		}
	};
	const updateAvatarInChats = {
		query: {"chats.id":req.headers.userid},
		objNew: {
			$set : { "chats.$.avatar" : avatarObjToSave }
		}
	};
	const queryParams = {
		query: {$or: [
		  {username: auth.username},
		  {email: auth.username}
		]},
		elementMatch: {avatar: 1}
	  };
	try {
		await datareader(User, queryParam, 'updateOne');
		await datareader(User, updateAvatarInContacts, 'updateMany');
		await datareader(User, updateAvatarInChats, 'updateMany');
		const savedAvatar = await datareader(User, queryParams, 'findElementMatch');
		fs.readdir(path.join(__dirname,`../../uploads/${req.headers.userid}/avatars/`), (err, items) => {
			items.forEach((file) => {
				fs.unlinkSync(path.join(__dirname,`../../uploads/${req.headers.userid}/avatars/${file}`));
			});
			fs.rmdirSync(path.join(__dirname,`../../uploads/${req.headers.userid}/avatars/`));
			// fs.rmdirSync(path.join(__dirname,`../../uploads/${req.headers.userid}`));
		});
		res.json(savedAvatar[0].avatar);
	} catch(err) {
		console.error('/upload_avatar', err);
      	res.sendStatus(500);
	}
})

module.exports = router;