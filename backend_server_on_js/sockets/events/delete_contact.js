const User = require('../../models/user');
const datareader = require('../../modules/datareader');

function deleteConact(socket, onlineClients) {
    socket.on("delete_contact", async obj => {
        /**
         * obj = {
         *  userId: string;
         *  deleteContactId: string;
         *  chatIdToDelete: string;
         *  deleteChat: boolean
         * }
         */

        const deleteContactInMyList = {
          query: {username: obj.userId},
          objNew: {$pull: {contacts: {id: obj.deleteContactId}}}
        };
        const deleteContactInOtherList = {
          query: {username: obj.deleteContactId},
          objNew: {$pull: {contacts: {id: obj.userId}}}
        };
        
        const deleteChat = {
          query: {$and: [{'users.username': obj.userId}, {'users.username': obj.deleteContactId}]},
          objNew: {$set:{type: 4}}
        };
        try {
          await datareader(User, deleteContactInMyList, 'updateOne');
          await datareader(User, deleteContactInOtherList, 'updateOne');
          
          if (obj.deleteChat) {
            const deleteChatInMyContact = {
              query: {username: obj.userId, "chats.id": obj.deleteContactId},
              objNew: {$pull: {chats: {chatId: obj.chatIdToDelete}}}
            };
            const deleteChatInOtherList = {
              query: {username: obj.deleteContactId, "chats.id": obj.userId},
              objNew: {$pull: {chats: {chatId: obj.chatIdToDelete}}}
            };
            await datareader(Chat, {$and: [{'users.username': obj.userId}, {'users.username': obj.deleteContactId}]}, 'deleteOne');
            await datareader(User, deleteChatInMyContact, 'updateOne');
            await datareader(User, deleteChatInOtherList, 'updateOne');
          } else {
            const deleteChatInMyContact = {
              query: {username: obj.userId, "chats.id": obj.deleteContactId},
              objNew: {$set: {"chats.$.type": 4}}
            };
            const deleteChatInOtherList = {
              query: {username: obj.deleteContactId, "chats.id": obj.userId},
              objNew: {$set: {"chats.$.type": 4}}
            };
            await datareader(User, deleteChatInMyContact, 'updateOne');
            await datareader(User, deleteChatInOtherList, 'updateOne');
            await datareader(Chat, deleteChat, 'updateOne');
          }
          if (onlineClients[obj.deleteContactId]) {
            Object.keys(onlineClients[obj.deleteContactId]).forEach(token => {
              onlineClients[obj.deleteContactId][token].emit('delete_contact', {userId: obj.userId, chatId: obj.chatIdToDelete});
            });  
          }
          if(onlineClients[obj.userId]) {
            Object.keys(onlineClients[obj.userId]).forEach(token => {
              onlineClients[obj.userId][token].emit('delete_contact', {userId: obj.deleteContactId,  chatId: obj.chatIdToDelete});
            });
          }
        } catch (error) {
          console.error('delete_contact', error);
        }
      });
}

module.exports = deleteConact;