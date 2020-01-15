import { datareader } from '../modules/datareader';
import { MongoActions } from '../interfaces/mongo-actions';
import { argv } from 'yargs';
import { Chat } from '../models/chats';

(async function() {
    try {
        const username1 = (argv as any).username1;
        const username2 = (argv as any).username2;
        if (!username1 && !username2) {
            console.error('Username is missed');
            console.log(`To delete chat type in console something like this \n npm run delete-chat -- --username1 testUsername --username2 testUsername2`);
            process.exit();
        }
        const params = {
            $and: [{'users.username': username1}, {'users.username': username2}]
        };
        const response = await datareader(Chat, params, MongoActions.FIND_ONE);
        if (response === null) {
            console.error(`Chat between user ${username1} and ${username2} was not found in database`);
            process.exit();
        }
        const deleteResponse = await datareader(Chat, params, MongoActions.DELETE_ONE);
        console.log('Database response after deleting chat', deleteResponse);
        console.log(`Private chat between users ${username1} and ${username2} succesfully deleted from database`);
        process.exit();
    } catch (error) {
        console.error('delete chat error', error);
        process.exit();
    }
})();
