import { datareader } from '../modules/datareader';
import { MongoActions } from '../interfaces/mongo-actions';
import { argv } from 'yargs';
import * as colors from 'colors';
import { User } from '../models/user';

 (async function() {
     try {
        const username = argv.username;
        if (!username) {
            console.error(`Username is missed`);
            console.log(`To delete user type in console something like this \n npm run delete-user -- --username testUsername`);
            process.exit();
        }
        const params = {username};
        const response = await datareader(User, params, MongoActions.FIND_ONE);
        console.log('Database response', response);
        if (response === null) {
            console.error(`User with username ${username} was not found in database`);
            process.exit();
        }
        const deleteResponse = await datareader(User, params, MongoActions.DELETE_ONE);
        console.log('Database response after deleting user', deleteResponse);
        console.log(`User with username ${username} was succesfully deleted from database`);
        process.exit();
     } catch (error) {
        console.error('delete user error', error);
        process.exit();
     }

 })();
