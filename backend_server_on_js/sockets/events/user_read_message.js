const Chat = require('../../models/chats');
const datareader = require('../../modules/datareader');
const ObjectId =  require('mongodb').ObjectID;

function userReadMessage(socket) {
    socket.on('user_read_message', async obj => {
        /**
         obj = {
        userId: string;
        chatId: string;
        }
         */

        const queryParams = {
          query: {"_id" : ObjectId(obj.chatId)},
          queryField1: 'messages',
          queryField2: 'unread',
          contidition: [obj.userId]
        };
        const result = await datareader(Chat, queryParams, 'arrayFilter');
        const promises = [];
        const chatId = result[0]._id;
        const unreadMes = result[0].query;
        unreadMes.forEach(mes => {
          mes.unread = mes.unread.filter(item => item !== obj.userId);
          promises.push(datareader(Chat, {query: {"_id": ObjectId(chatId), messages:  {$elemMatch:{_id: ObjectId(mes._id)}}}, objNew: {$set: {'messages.$.unread': mes.unread}}}, 'updateOne'));
        });
        const updateMes = await Promise.all(promises);
      });

}

module.exports = userReadMessage;