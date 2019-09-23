const router = require('express').Router()
const jwt = require('jwt-simple');
const User = require('../../models/user');
const Chat = require('../../models/chats');
const datareader = require('../../modules/datareader');

class ChatData {
  constructor(chat) {
    this.id = chat._id;
    this.users = chat.users;
    this.email = chat.email;
    this.messages = chat.messages;
  }
}

router.post('/new_private_chat/', async function (req, res, next) {
    let auth;
    if(!req.headers['authorization']) {
      return res.sendStatus(401)
    };
    try {
      auth = jwt.decode(req.headers['authorization'], req.headers['token_key']);
    } catch (err) {
      return res.sendStatus(401)
    };
    // Params for search in Chat DB (exist chat): req.body.users[0] - id autorisated user, а req.body.users[1] - id of second user
    const findChatParams = {
      $and:[{'users.username': req.body.users[0].username}, {'users.username': req.body.users[1].username}]
    };
    
    // Params for search users in User DB
    const params = {
      $or: [
        {username: auth.username},
        {email: auth.username}
      ]
    };
    const params2 = {
      $or: [
        {username: req.body.users[1].username},
        {email: req.body.users[1].email}
      ]
    };
    
    try {
      /* findChat - try to find exist private chat
      If chat exist - add exist chat ID to contacts.$.private_chat (both users).
      If chat doesn't exist - create new chat and add to contacts.$.private_chat (both users).*/

      const findChat = await datareader(Chat, findChatParams, 'findOne');

      if(findChat == null){
        // Create new private chat and add ID to users
        const chat = new Chat;
        chat.users = req.body.users;
        chat.email = req.body.email;
        chat.messages = [];
        chat.type = 1;
        const chatItem1 = {};
        const response1 = await datareader(User, {username: req.body.users[1].username}, 'findOne');
        chatItem1.id = req.body.users[1].username;
        chatItem1.name = response1.name;
        chatItem1.users = req.body.users;
        chatItem1.avatar = response1.avatar;
        chatItem1.chatId = chat.id;
        chatItem1.type = chat.type;
        //Create chat for second User
        const chatItem2 = {};
        const response2 = await datareader(User, {username: auth.username}, 'findOne');
        chatItem2.id = response2.username;
        chatItem2.name = response2.name;
        chatItem2.users = req.body.users;
        chatItem2.avatar = response2.avatar;
        chatItem2.chatId = chat.id;
        chatItem2.type = chat.type;

        const updateParams = {
          query: params,
          objNew:  {$push: {chats: chatItem1}}};
        const updateChat = await datareader(User, updateParams, 'updateOne');
        const updateParams2 = {
          query: params2,
          objNew:  {$push: {chats: chatItem2}}};
        const updateChat2 = await datareader(User, updateParams2, 'updateOne');
        chat.save((err, data) => {
          if (err) {
            res.json(err);
          }
          else {
            const createdChat = new ChatData(chat);
            datareader(User, params, 'findOne')
              .then(response => {
                let user1 = '', user2 = '';
                for (let i=0; i<chat.users.length;i++) {
                  user1 = chat.users[0];
                  user2 = chat.users[1];
                }
                const updateUser1Params = {
                  query: {"username" : user1.username, "contacts.id" : user2.username},
                  objNew: {$set : { "contacts.$.private_chat" : createdChat.id }}
                };
                datareader(User, updateUser1Params, 'updateOne');
                const updateUser2Params = {
                  query: {"username" : user2.username, "contacts.id" : user1.username},
                  objNew: {$set : { "contacts.$.private_chat" : createdChat.id }}
                };
                datareader(User, updateUser2Params, 'updateOne');
                return res.json(chatItem2)
              })
          }
        })
      } else {
        // Add exist chat ID to contacts.$.private_chat (both users)
        const response1 = await datareader(User, {username: req.body.users[1].username}, 'findOne');
        const response2 = await datareader(User, {username: auth.username}, 'findOne');
        const updateUser1Params = {
          query: {"username" : response1.username, "contacts.id" : response2.username},
          objNew: {$set : { "contacts.$.private_chat" : findChat._id }}
        };
        await datareader(User, updateUser1Params, 'updateOne');
        const updateUser1ChatStatus = {
          query: {"username" : response1.username, "chats.id" : response2.username},
          objNew: {$set : { "chats.$.type": 1 }}
        };
        await datareader(User, updateUser1ChatStatus, 'updateOne');
        const updateUser2Params = {
          query: {"username" : response2.username, "contacts.id" : response1.username},
          objNew: {$set : { "contacts.$.private_chat" : findChat._id }}
        };
        await datareader(User, updateUser2Params, 'updateOne');
        const updateUser2ChatStatus = {
          query: {"username" : response2.username, "chats.id" : response1.username},
          objNew: {$set : { "chats.$.type": 1 }}
        };
        await datareader(User, updateUser2ChatStatus, 'updateOne');
        // Add exist chat to array "chats" (both users)
        // Check in array "chats"
        const checkUser1ChatsParams = {"username" : response1.username, "chats.chatId" : findChat._id};
        const checkUser2ChatsParams = {"username" : response2.username, "chats.chatId" : findChat._id};
        // User 1
        const resultFindChatUser1 = await datareader(User, checkUser1ChatsParams, 'findOne');
        if (!resultFindChatUser1) {
          const chatItem1 = {};
          chatItem1.id = response2.username;
          chatItem1.name = response2.name;
          chatItem1.users = req.body.users;
          chatItem1.avatar = response2.avatar;
          chatItem1.chatId = findChat._id;
          chatItem1.type = 1;
          const updateParams = {
            query: params2,
            objNew:  {$push: {chats: chatItem1}}};
          const updateChat = await datareader(User, updateParams, 'updateOne');
        }
        // User 2
        const resultFindChatUser2 = await datareader(User, checkUser2ChatsParams, 'findOne');
        const chatItem2 = {};
        chatItem2.id = response1.username;
        chatItem2.name = response1.name;
        chatItem2.users = req.body.users;
        chatItem2.avatar = response1.avatar;
        chatItem2.chatId = findChat._id;
        chatItem2.type = 1;
        if (!resultFindChatUser2) {
          const updateParams2 = {
            query: params,
            objNew:  {$push: {chats: chatItem2}}};
          const updateChat = await datareader(User, updateParams2, 'updateOne');
        }
        return res.json(chatItem2);
      }
    } catch (err) {
      console.log('err 500');
      res.sendStatus(500);
    }
  });

  module.exports = router;
