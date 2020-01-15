const User = require('../../models/user');
const datareader = require('../../modules/datareader');

function addUser(socket, onlineClients) {
    socket.on("add_user", async obj => {
        /**
         * obj = {
         *  queryUserId: string;
         *  userId: string;
         * }
         */
        if (obj.queryUserId === obj.userId) {
          return
        }
        let exsistCont = false;
        const queryParamDb = {
            username: obj.userId
        };

        try {
          const result = await datareader(User, queryParamDb, 'findOne');
          exsistCont = result.contacts.some(item => {
            return item.id === obj.queryUserId 
         });
          if (exsistCont) {
            return
          }
          const findRes = await datareader(User, {username: obj.queryUserId}, 'findOne');
          findRes.private_chat = '0';
          findRes.status = 3;
          const contact = new ContactData(findRes);
          const updateParams = {
            query: {username: obj.userId},
            objNew:  {$push: {contacts: contact}}
          };
          const updateRes = await datareader(User, updateParams, 'updateOne');
          //добавить найденому другу тоже со статусом ожидания подтверждения с его стороны
          const params2 = {
            $or: [
              {username: contact.id},
              {email: contact.email}
            ]
          };
          const result2 = new ContactData(result);
          result2.private_chat = '0';
          result2.status = 2;
          const addParams = {
            query: params2,
            objNew:  {$push: {contacts: result2}}
          };
          const updateFindedUser = await datareader(User, addParams, 'updateOne');
          if (onlineClients[obj.queryUserId]) {
            Object.keys(onlineClients[obj.queryUserId]).forEach(token => {
              onlineClients[obj.queryUserId][token].emit('add_user_request', result2);
            });
          }
          if(onlineClients[obj.userId]) {
            Object.keys(onlineClients[obj.userId]).forEach(token => {
              onlineClients[obj.userId][token].emit('add_user', contact);
            });
          }
        } catch(error) {
          console.error ('add_user', error);
        }

      });
}

module.exports = addUser;