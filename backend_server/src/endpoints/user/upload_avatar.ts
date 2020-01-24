import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { User } from '../../models/user';
import { Avatar, Auth } from '../../interfaces/types';

export class UploadAvatar {

    public router: Router;
    private fileName: string;
    private storage;
    private upload;
    constructor(private express) {
        this.storage = multer.diskStorage({
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
              fs.readdir(path.join(__dirname, `../../uploads/${userId}/avatars/`), (err, items) => {
                  items.forEach((fileName) => {
                      fs.unlinkSync(path.join(__dirname, `../../uploads/${userId}/avatars/${fileName}`));
                  });
              });
              cb(null,  path.join(__dirname, uploadPathNested2));
            },
            filename: function (req, file, cb) {
                this.fileName = file.fieldname + '-' + Date.now();
              cb(null, this.fileName);
            }
        });
        this.upload = multer({ storage: this.storage, fileFilter: this.fileFilter });
        this.init();
    }

    private init(): void {
        this.router = this.express.Router();
        this.router.post('/upload_avatar', this.upload.single('image'), async (req, res, next) => {
            let auth: Auth;
              if (!req.headers['authorization']) {
              return res.sendStatus(401);
            }
            try {
              auth = jwt.decode(req.headers['authorization'], req.headers['token_key'] as string);
            } catch (err) {
              return res.sendStatus(401);
            }
            const params = {
              $or: [
                {username: auth.username},
                {email: auth.username}
              ]
            };
            try {
                const img = fs.readFileSync((req as any).file.path);
                const encode_image = img.toString('base64');
                // BASE64 object
                const finalImg = {
                contentType: (req as any).file.mimetype,
                image: new Buffer(encode_image, 'base64')
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
                    query: { 'contacts.id': req.headers.userid},
                    objNew: {
                        $set : { 'contacts.$.avatar' : avatarObjToSave }
                    }
                };
                const updateAvatarInChats = {
                    query: {'chats.id': req.headers.userid},
                    objNew: {
                        $set : {'chats.$.avatar' : avatarObjToSave }
                    }
                };
                const queryParams = {
                    query: {$or: [
                    {username: auth.username},
                    {email: auth.username}
                    ]},
                    elementMatch: {avatar: 1}
                };
                await datareader(User, queryParam, MongoActions.UPDATE_ONE);
                await datareader(User, updateAvatarInContacts, MongoActions.UPDATE_MANY);
                await datareader(User, updateAvatarInChats, MongoActions.UPDATE_MANY);
                const savedAvatar: {_id: string, avatar: Avatar}[] = await datareader(User, queryParams, MongoActions.FIND_ELEMENT_MATCH);
                fs.readdir(path.join(__dirname, `../../uploads/${req.headers.userid}/avatars/`), (err, items) => {
                    items.forEach((file) => {
                        fs.unlinkSync(path.join(__dirname, `../../uploads/${req.headers.userid}/avatars/${file}`));
                    });
                    fs.rmdirSync(path.join(__dirname, `../../uploads/${req.headers.userid}/avatars/`));
                });
                res.json(savedAvatar[0].avatar);
            } catch (error) {
                console.error('/upload_avatar', error);
                res.status(500).json({error, status: 500});
            }
        });
    }

    private fileFilter(req, file, cb): void {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb({
                success: false,
                message: 'Invalid file type. Only jpg, png image files are allowed.'
            }, false);
        }
    }
}
