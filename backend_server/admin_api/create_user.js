const datareader = require('../modules/datareader');
const User = require( '../models/user');
const argv = require ('yargs').argv;
const bcrypt = require ('bcrypt');
const path = require('path');
const fs = require('fs');
const colors = require('colors');

/**
 * interface User {
    email: string;
    password: string;
    username: string;
    name: string;
}
 */
function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}


(async function() {
    try {
        let userData = {};
        let email;
        let password;
        let username;
        let name;
        const pathfile = argv.credsUser;
        if(pathfile) {
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
            console.error(`Some input params are missed`.red);
            console.info(`To create user type in console something like this \n 
            npm run create-user -- --username testUsername --name Test --email test@mail.com --password qwerty \n
            Or npm run create-user -- --credsUser ../testUserCreds.json 
            `.green);
            process.exit();
            return
        }
        
        if (!validateEmail(email)) {
            console.error(`Invalid email`.red);
            process.exit();
            return
        }
        const params = {
            $or: [
              {username: username},
              {email: email}
            ]
          };
        const response = await datareader(User, params, 'findOne');
        if (response !== null) {
            console.error(`User with email ${email} or username ${username} is already exists. 
            Try another username or email`.red);
            process.exit();
            return
        }
        const defaultAvatar = {
            owner: 'default',
            url: "assets/img/default-profile-image.png"
        };
        const user = new User;
        user.username = username;
        user.email = email;
        user.name = name;
        user.phone = "Set your phone number";
        user.avatar = defaultAvatar;
        user.events = [];
        user.notifications = [];
        user.chats = [];

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error('error in bcrypt'.red, err);
                process.exit();
            }
            else {
              user.password = hash;
              user.save(err => {
                if (err) {
                    console.error('error in database'.red, err);
                    process.exit();
                }
                else {
                    console.info(`User with username ${username}, email ${email} was created succesfully!`.green.bold);
                    process.exit();
                }
              })
            }
          })

    } catch(err) {
        console.error('create user error', err);
        process.exit();
    }

})()
