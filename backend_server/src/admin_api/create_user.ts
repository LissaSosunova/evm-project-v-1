import { datareader } from '../modules/datareader';
import { User } from '../models/user';
import { MongoActions } from '../interfaces/mongo-actions';
import { argv } from 'yargs';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as fs from 'fs';
import { PendingRegUser, Avatar, UserDataObj } from '../interfaces/types';

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

(async function() {
    try {
        let userData: PendingRegUser = {} as PendingRegUser;
        let email: string;
        let password: string;
        let username: string;
        let name: string;
        const pathfile: string = argv.credsUser;
        if (pathfile) {
            userData = JSON.parse(fs.readFileSync(path.resolve(__dirname, pathfile), 'utf8'));
            email = userData.email;
            password = userData.password;
            username = userData.username;
            name = userData.name;
        } else {
            email = argv.email;
            password = argv.password;
            username = argv.username;
            name = argv.name;
        }
        if (!email || !password || !username || !name) {
            console.error(`Some input params are missed`);
            console.log(`To create user type in console something like this \n
            npm run create-user -- --username testUsername --name Test --email test@mail.com --password qwerty \n
            Or npm run create-user -- --credsUser ./testUserCreds.json
            `);
            process.exit();
        }
        if (!validateEmail(email)) {
            console.error(`Invalid email`);
            process.exit();
        }
        const params = {
            $or: [
              {username: username},
              {email: email}
            ]
          };
        const response: UserDataObj = await datareader(User, params, MongoActions.FIND_ONE);
        if (response !== null) {
            console.error(`User with email ${email} or username ${username} is already exists.
            Try another username or email`);
            process.exit();
        }
        const defaultAvatar: Avatar = {
            owner: 'default',
            url: 'assets/img/default-profile-image.png'
        };
        const user = new User;
        user.username = username;
        user.email = email;
        user.name = name;
        user.phone = 'Set your phone number';
        user.avatar = defaultAvatar;
        user.events = [];
        user.notifications = [];
        user.chats = [];

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error('error in bcrypt', err);
                process.exit();
            } else {
              user.password = hash;
              user.save(error => {
                if (error) {
                    console.error('error in database', err);
                    process.exit();
                } else {
                    console.log(`User with username ${username}, email ${email} was created succesfully!`);
                    process.exit();
                }
              });
            }
          });

    } catch (err) {
        console.error('create user error', err);
        process.exit();
    }

})();
