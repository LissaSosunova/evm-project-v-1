const datareader = require('../modules/datareader');
const User = require( '../models/user');
const argv = require ('yargs').argv;
const bcrypt = require ('bcrypt');
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
        const email = argv.email;
        const password = argv.password;
        const username = argv.username;
        const name = argv.name;
        if (!email || !password || !username || !name) {
            console.error(`Some input params are missed`.red);
            console.info(`To create user type in console something like this \n npm run create-user -- --username testUsername --name Test --email test@mail.com --password qwerty`.green);
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
