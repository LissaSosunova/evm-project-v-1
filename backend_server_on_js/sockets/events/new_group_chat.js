const Chat = require('../../models/chats');
const datareader = require('../../modules/datareader');

function newGroupChat(socket, onlineClients) {
    /**
     * obj = {
     *  users: userItem[];
     *  chatName: string;
     *  admin: string
     * }
     * userItem = {
     *  username: string;
     *  name: string;
     *  email: string;
     * }
     */
    socket.on('new_group_chat', async obj => {
        const chat = new Chat;
        chat.users = obj.users;
        chat.messages = [];
        chat.type = 2;
        chat.chatName = obj.chatName;
        chat.admin = obj.admin;
        await datareader(chat, null, 'save');
        obj.users.forEach(async user => {
            const chatToSave = {
                name: obj.chatName,
                users: obj.users,
                chatId: chat._id,
                // avatar: '', добавить аватарку чата по умолчанию!!!
                type: 2
            };
            const updateParams = {
                query: user.username,
                objNew:  {$push: {chats: chatToSave}}
            };
            await datareader(User, updateParams, 'updateOne');
            if(onlineClients[user.username]) {
                Object.keys(onlineClients[user.username]).forEach(token => {
                    onlineClients[user.username][token].emit('new_group_chat', chatToSave);
                });
            }
        });
    });
}

module.exports = newGroupChat;