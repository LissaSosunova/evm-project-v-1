import { datareader } from '../../modules/datareader';
import { OnlineClients, EventDb, UserDataObj, DbQuery } from '../../interfaces/types';
import * as socketIo from 'socket.io';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Event } from '../../models/event';
import { EventData} from '../../modules/eventData';
import { User } from '../../models/user';
import { Model } from 'mongoose';

export function newEvent(socket: socketIo.Socket, onlineClients: OnlineClients): void {
    socket.on('new_event', async (obj: EventDb) => {
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
          await datareader(event as any, null, MongoActions.SAVE);
          const createdEvent: EventData = new EventData(event);
          const response: UserDataObj = await datareader(User, {username:  obj.authorId}, MongoActions.FIND_ONE);
          const updateParams: DbQuery = {
            query: {username: response.username},
            objNew: {$push: {events: createdEvent}}
          };
          await datareader(User, updateParams, MongoActions.UPDATE_ONE);
          if (event.members && event.members.invited && event.members.invited.length !== 0) {
            event.notification.id = event._id;
            event.members.invited.forEach(async item => {
              const update: DbQuery = {
                query: {username: item},
                objNew: {$push: {events: createdEvent}}
              };
              await datareader(User, update, MongoActions.UPDATE_ONE);
              if (event.status) {
                const updateNotifications: DbQuery = {
                  query: {username: item},
                  objNew: {$push: {notifications: event.notification}}
                };
                await datareader(User, updateNotifications, MongoActions.UPDATE_ONE);
              }
            });
          }
          if (onlineClients[obj.authorId]) {
            Object.keys(onlineClients[obj.authorId]).forEach(token => {
              onlineClients[obj.authorId][token].emit('new_event_confirm', { message: 'Saved', eventId: createdEvent.id});
            });
          }
          obj.members.invited.forEach(userId => {
            if (onlineClients[userId]) {
              Object.keys(onlineClients[userId]).forEach(token => {
                onlineClients[userId][token].emit('new_event', obj);
              });
            }
          });
        } catch (error) {
          console.error('new event', error);
          if (onlineClients[obj.authorId]) {
            Object.keys(onlineClients[obj.authorId]).forEach(token => {
              onlineClients[obj.authorId][token].emit('error', {event: 'new_event', error});
            });
          }
        }
      });
}
