const datareader = require('../modules/datareader');
const User = require( '../models/user');
const argv = require ('yargs').argv;
const colors = require('colors');

/**
 * interface User {
    username: string;
}
 */

 (async function() {
     try {
        const username = argv.username;
        if (!username) {
            console.error(`Username is missed`.red);
            console.info(`To delete user type in console something like this \n npm run delete-user -- --username testUsername`.green);
            process.exit();
            return
        }
        const params = {username};
        const response = await datareader(User, params, 'findOne');
        console.log('Database response'.italic, response);
        if (response === null) {
            console.error(`User with username ${username} was not found in database`.red);
            process.exit();
            return
        }
        const deleteResponse = await datareader(User, params, 'deleteOne');
        console.log('Database response after deleting user'.italic, deleteResponse);
        console.info(`User with username ${username} was succesfully deleted from database`.green.bold);
        process.exit();
     } catch(error) {
        console.error('delete user error'.red, error);
        process.exit();
     }

 })()
 