const Chat = require('../../models/chats');
const datareader = require('../../modules/datareader');
const ObjectId = require('mongodb').ObjectID;
const User = require('../../models/user');

function deleteUserFromGroupChat(socket, onlineClients) {
    /**
     * obj = {
     *  chatId: string;
     *  userToDelete: string;
     * }
     */

     socket.on('delete_user_from_group_chat', async obj => {
        const deleteUserParams = {
            query: {_id: ObjectId(obj.chatId)},
            objNew: {$pull: {users: obj.userToDelete}}    
        };
        await datareader(Chat, deleteUserParams, 'updateOne');
        const deleteChatparams = {
            query: obj.userToDelete,
            objNew:  {$pull: {chats: {chatId: obj.chatId}}}
        }
        await datareader(User, deleteChatparams, 'updateOne');
        if(onlineClients[obj.userToDelete]) {
            Object.keys(onlineClients[obj.userToDelete]).forEach(token => {
                onlineClients[obj.userToDelete][token].emit('delete_user_from_group_chat', {chatId: obj.chatId, userToDelete: obj.userToDelete});
            })
        }
     });
}

module.exports = deleteUserFromGroupChat;
