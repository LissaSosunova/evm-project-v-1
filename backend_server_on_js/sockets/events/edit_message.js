const Chat = require('../../models/chats');
const datareader = require('../../modules/datareader');
const ObjectId =  require('mongodb').ObjectID;

function editMessage(socket, clientsInChat) {
    socket.on('edit_message', async obj => {
        /**
         * obj = {
         *  text: string,
         *  userId: string,
            chatId: string,
            messageId: string,
            authorId: string
         * }
         */
        try {
          if(obj.userId !== obj.authorId) {
            return;
          };
          const editMessage = {
            query: {"_id": ObjectId(obj.chatId), "messages._id": ObjectId(obj.messageId)},
            objNew: {$set:  {'messages.$.edited': true, 'messages.$.text': obj.text}}
          };
          await datareader(Chat, editMessage, 'updateOne');
          Object.keys(clientsInChat[obj.chatId]).forEach(userId => {
            Object.keys(clientsInChat[obj.chatId][userId]).forEach(token => {
                clientsInChat[obj.chatId][userId][token].emit('edit_message',obj);
            });
        })
        } catch(err) {
          console.error('edit_message', err);
        }

      });
}

module.exports = editMessage;