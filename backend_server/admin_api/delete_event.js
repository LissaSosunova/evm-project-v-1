const datareader = require('../modules/datareader');
const Event = require( '../models/event');
const argv = require ('yargs').argv;
const colors = require('colors');

(async function() {
    try {
        const name = argv.eventName;
        if(!name) {
            console.error(`Event name is missed`.red);
            console.info(`To delete event type in console something like this \n npm run delete-event -- --eventName testevent`.green);
            process.exit();
            return
        }
        const params = {name};
        const response = await datareader(Event, params, 'findOne');
        if (response === null) {
            console.error(`Event with name ${name} was not found in database`.red);
            process.exit();
            return
        }
        const deleteResponse = await datareader(Event, params, 'deleteOne');
        console.log('Database response after deleting event'.italic, deleteResponse);
        console.info(`Event with name ${name} was succesfully deleted from database`.green.bold);
        process.exit();
    } catch(error) {
        console.error('delete event error'.red, error);
        process.exit();
    }
})()
