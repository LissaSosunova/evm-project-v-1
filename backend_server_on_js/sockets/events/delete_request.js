const User = require('../../models/user');
const datareader = require('../../modules/datareader');

function deleteRequest(socket, onlineClients) {
    socket.on("delete_request", async obj => {
        /**
         * obj = {
         *  queryUserId: string;
         *  userId: string;
         * }
         */
        const queryParamDb = {
          query: {username: obj.userId},
          objNew: {$pull: {contacts: {id: obj.queryUserId}}}
        };
        const queryDb = {
          query: {username: obj.queryUserId},
          objNew: {$pull: {contacts: {id: obj.userId}}}
        }
        try {
          await datareader(User, queryParamDb, 'updateOne');
          await datareader(User, queryDb, 'updateOne');
          if (onlineClients[obj.queryUserId]) {
            Object.keys(onlineClients[obj.queryUserId]).forEach(token => {
              onlineClients[obj.queryUserId][token].emit('reject_request', {userId: obj.userId});
            });  
          }
          if(onlineClients[obj.userId]) {
            Object.keys(onlineClients[obj.userId]).forEach(token => {
              onlineClients[obj.userId][token].emit('delete_request', {userId: obj.queryUserId});
            });
          }
        } catch (error) {
          console.error('delete_request', error);
        }
      });

}

module.exports = deleteRequest;