import { datareader } from '../modules/datareader';
import { MongoActions } from '../interfaces/mongo-actions';
import { argv } from 'yargs';
import * as colors from 'colors';
import { Event } from '../models/event';
import { EventDb } from '../interfaces/types';

(async function() {
    try {
        const name = argv.eventName;
        if (!name) {
            console.error(`Event name is missed`);
            console.log(`To delete event type in console something like this \n npm run delete-event -- --eventName testevent`);
            process.exit();
        }
        const params = {name};
        const response: EventDb = await datareader(Event, params, MongoActions.FIND_ONE);
        if (response === null) {
            console.error(`Event with name ${name} was not found in database`);
            process.exit();
        }
        const deleteResponse = await datareader(Event, params, MongoActions.DELETE_ONE);
        console.log('Database response after deleting event', deleteResponse);
        console.log(`Event with name ${name} was succesfully deleted from database`);
        process.exit();
    } catch (error) {
        console.error('delete event error', error);
        process.exit();
    }
})();
