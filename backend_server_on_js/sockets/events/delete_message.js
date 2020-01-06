const Chat = require('../../models/chats');
const datareader = require('../../modules/datareader');
const ObjectId =  require('mongodb').ObjectID;

function deleteMessage(socket, clientsInChat, onlineClients) {
    socket.on('delete_message', async obj => {
        /**
         * obj = {
         * userId: string,
         * authorId: string
         * messageId: string,
         * chatId: string,
         * unread: string[]
         * }
         */
        try {
          if(obj.userId !== obj.authorId) {
            return;
          };
          const deleteMessage = {
            query: {"_id": ObjectId(obj.chatId)},
            objNew: {$pull: {messages: {_id: ObjectId(obj.messageId)}}}
          }
          await datareader(Chat, deleteMessage, 'updateOne');
            Object.keys(clientsInChat[obj.chatId]).forEach(userId => {
              Object.keys(clientsInChat[obj.chatId][userId]).forEach(token => {
                  clientsInChat[obj.chatId][userId][token].emit('delete_message',obj);
              });
          });
            obj.unread.forEach(userId => {
              if(onlineClients[userId]) {
                Object.keys(onlineClients[userId]).forEach(token => {
                  onlineClients[userId][token].emit('delete_message_out_of_chat',obj)
                })
              }
            });
          } catch(err) {
            console.error('delete_message', err);
        }
          
      });
}

module.exports = deleteMessage;