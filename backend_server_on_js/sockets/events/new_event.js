const Event = require('../../models/event');
const datareader = require('../../modules/datareader');
const EventData = require('../../modules/eventData');

function newEvent(socket, onlineClients) {
    socket.on("new_event", async obj => {
        /**
         * obj = {
         *  _id?: string;
            name: string;
            status: boolean;
            date_type: string;
            date: EventDateDb;
            place: eventPlace;
            members: eventMembers;
            additional: string;
            notification?: eventNotification;
            authorId: string;
         * }
          EventDateDb {
            startDate: number;
            endDate?: number;
          }
          eventPlace {
            location: string
          }
          eventMembers {
            invited: string[];
          }
          eventNotification {
            type: string;
            message: string;
            id: string;
            status: boolean
          }
         */
        const event = new Event;
        event.name = obj.name;
        event.status = obj.status;
        event.date_type = obj.date_type;
        event.date = obj.date;
        event.place = obj.place;
        event.members = obj.members;
        event.additional = obj.additional;
        event.notification = { type: 'event', message: 'You are invited to new event', id: '', status: true};
        try {
          await datareader(event, null, 'save'); 
          const createdEvent = new EventData(event);
          const response = await datareader(User, {username:  obj.authorId}, 'findOne');
          const updateParams = {
            query: {username: response.username},
            objNew: {$push: {events:createdEvent}}
          };
          await datareader(User, updateParams, 'updateOne');
          if(event.members && event.members.invited && event.members.invited.length !== 0){
            event.notification.id = event._id;
            event.members.invited.forEach(async item => {
              const update = {
                query: {username: item},
                objNew: {$push: {events:createdEvent}}
              };
              await datareader(User, update, 'updateOne');
              if(event.status){
                const updateNotifications = {
                  query: {username: item},
                  objNew: {$push: {notifications:event.notification}}
                };
                await datareader(User, updateNotifications, 'updateOne');
              }
            });
          }
          if (onlineClients[obj.authorId]) {
            Object.keys(onlineClients[obj.authorId]).forEach(token => {
              onlineClients[obj.authorId][token].emit("new_event_confirm", { message: "Saved", eventId: createdEvent.id})
            });
          }
          obj.members.invited.forEach(userId => {
            if (onlineClients[userId]) {
              Object.keys(onlineClients[userId]).forEach(token => {
                onlineClients[userId][token].emit("new_event", obj);
              });
            }
          })
        } catch(err) {
          console.error('new event', err)
        }
        ;
      });
}

module.exports = newEvent;