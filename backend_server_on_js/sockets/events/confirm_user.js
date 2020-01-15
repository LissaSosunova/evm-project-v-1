const User = require('../../models/user');
const datareader = require('../../modules/datareader');

function confirmUser(socket, onlineClients) {
    socket.on('confirm_user', async obj => {
        /**
         * obj = {
         *  queryUserId: string;
         *  userId: string;
         * }
         */
        if (obj.queryUserId === obj.userId) {
          return
        }
        const params1 = {username: obj.userId};
        const params2 = {username: obj.queryUserId};
        try {
          const response2 = await datareader(User, params2, 'findOne');
          const update2 = {
            query: {"username" : response2.username, "contacts.id": obj.userId},
            objNew: {$set : {"contacts.$.status" : 1 }}
          };
          await datareader(User, update2, 'updateOne' );
          const response1 = await datareader(User, params1, 'findOne');
          const update1 = {
            query: {"username" : response1.username, "contacts.id": obj.queryUserId},
            objNew: {$set : { "contacts.$.status" : 1 }}
          }
          await datareader(User, update1, 'updateOne');
          if (onlineClients[obj.queryUserId]) {
            Object.keys(onlineClients[obj.queryUserId]).forEach(token => {
              onlineClients[obj.queryUserId][token].emit('confirm_user_request', {userId: obj.userId});
            })
          }  
          if(onlineClients[obj.userId]) {
            Object.keys(onlineClients[obj.userId]).forEach(token => {
              onlineClients[obj.userId][token].emit('confirm_user', {userId: obj.queryUserId});
            })
          }
          
        } catch(error) {
          console.error('confirm_user', error);
        }
      });

}

module.exports = confirmUser;