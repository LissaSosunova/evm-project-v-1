const Chat = require('../../models/chats');
const datareader = require('../../modules/datareader');
const ObjectId = require('mongodb').ObjectID;
const User = require('../../models/user');

function deleteGroupChat(socket, onlineClients) {
    /**
     * obj = {
     *  chatId: string;
     *  admin: string;
     *  users: userItem[];
     * }
     *  userItem = {
     *   username: string;
     *   name: string;
     *   email: string;
     * }
     */

     socket.on('delete_group_chat', async obj => {
        const findChatParams = {
            _id: ObjectId(obj.chatId),
        };
        const chatToDelete = await datareader(Chat, findChatParams, 'findOne');
        if (chatToDelete.admin !== obj.admin) {
            return
        }
        await datareader(Chat, findChatParams, 'deleteOne');
        obj.users.forEach(async user => {
            const params = {
                query: user.username,
                objNew:  {$pull: {chats: {chatId: obj.chatId}}}
            }
            await datareader(User, params, 'updateOne');
            if(onlineClients[user.username]) {
                Object.keys(onlineClients[user.username]).forEach(token => {
                    onlineClients[user.username][token].emit('delete_group_chat', {chatId: obj.chatId});
                });
            }
        });
     });
}

module.exports = deleteGroupChat;