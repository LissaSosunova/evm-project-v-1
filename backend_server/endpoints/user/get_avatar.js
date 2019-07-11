const router = require('express').Router();
const fs = require('fs');
const path = require('path');


router.get('/uploads/:userId/avatars/:fileName', function (req, res, next) {
	const userId = req.params.userId;
	const fileName = req.params.fileName;
	try {
		fs.readFile(path.join(__dirname, `../../uploads/${userId}/avatars/${fileName}`), (err, data) => {
			if(err) throw err;
			else {
				res.end(data);
			}
		})
	
	} catch(err) {
		console.error('/uploads/:userId/avatars/:fileName', err);
      	res.sendStatus(500);
	}
})

module.exports = router;