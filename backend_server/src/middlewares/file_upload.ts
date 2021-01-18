import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { Auth } from '../interfaces/types';
import { AuthToken } from '../abstract_classes/auth_abstract';

export class FileUpload extends AuthToken {

    public upload: multer.Multer;
    private fileName: string;
    private storage: multer.StorageEngine;

    constructor() {
        super();
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const auth: Auth = this.checkToken(req);
                const userId = auth.id;
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