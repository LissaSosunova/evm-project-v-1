const datareader = require('../modules/datareader');
const Chat = require( '../models/chats');
const argv = require ('yargs').argv;
const colors = require('colors');

(async function(){
    try {
        const username1 = argv.username1;
        const username2 = argv.username2;
        if(!username1 && !username2) {
            console.error(`Username is missed`.red);
            console.info(`To delete chat type in console something like this \n npm run delete-chat -- --username1 testUsername --username2 testUsername2`.green);
            process.exit();
            return
        }
        const params = {
            $and: [{'users.username': username1}, {'users.username': username2}]
        };
        const response = await datareader(Chat, params, 'findOne');
        if (response === null) {
            console.error(`Chat between user ${username1} and ${username2} was not found in database`.red);
            process.exit();
            return
        }
        const deleteResponse = await datareader(Chat, params, 'deleteOne');
        console.info('Database response after deleting chat'.italic, deleteResponse);
        console.info(`Private chat between users ${username1} and ${username2} succesfully deleted from database`.green.bold);
        process.exit();
    } catch(error) {
        console.error('delete chat error'.red, error);
        process.exit();
    }
})()
