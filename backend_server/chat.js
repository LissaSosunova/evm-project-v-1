const router = require('express').Router()
const jwt = require('jwt-simple');
const config = require('./config');
const User = require('./models/user');
const Chat = require('./models/chats');
const datareader = require('./datareader');
// const ObjectId = require('mongodb').ObjectId;
// const url = require('url');
// const queryString = require('querystring');

class ChatData {
  constructor(chat) {
    this.id = chat._id;
    this.users = chat.users;
    this.email = chat.email;
    this.messages = chat.messages;
  }
}

// router.get('/chat/', async function (req, res, next){
//   const param = url.parse(req.url).query;
//   const id = queryString.parse(param).id;
//   let auth;
//     try {
//     auth = jwt.decode(req.headers['authorization'], config.secretkey);
//   } catch (err) {
//     return res.sendStatus(401)
//   }

//     const params = {
//       $or: [
//         {username: auth.username},
//         {email: auth.username}
//       ]
//     };
  
//     try {
//       const queryParams = {
//         query: {
//           $or: [
//             {username: auth.username},
//             {email: auth.username}
//           ]
//         },
//         elementMatch: {chats:{$elemMatch:{id: id}}}
//       };
//       const resp = await datareader(User, queryParams, 'findOneElementMatch');
//       if (resp.chats == false) {
//         const response = await datareader(User, {username: id}, 'findOne');
//         const chats = {};
//         chats.id = response.username;
//         chats.name = response.name;
//         chats.avatar = response.avatar;
//         const updateParams = {
//           query: params, 
//           objNew:  {$push: {chats: chats}}};
//         const updateChat = await datareader(User, updateParams, 'updateOne');
//         const findChat = await datareader(Chat, {$and:[{users: id, $or:[{users: auth.username},{email: auth.username}]}]}, 'findOne');
//         if (findChat == null) {
//           const data = await datareader(User, params, 'findOne');
//           const myId = data.username;
//                 const email = data.email;
//                 const chat = new Chat;
//                 chat.users.push(myId);
//                 chat.users.push(id);
//                 chat.email.push(email);
//                 chat.type = 'private';
//                 const user = await datareader(User, {username: id}, 'findOne');
//                 const userEmail = user.email;
//                 chat.email.push(userEmail);
//                 const saveRes = await datareader(chat, null, 'save');
//         } 
//       }
    
//       const chats = await datareader(Chat, {$and:[{users: id, $or:[{users: auth.username},{email: auth.username}]}]}, 'findOne');
//       res.json(chats);
//     } catch (err) {
//       throw new Error (err);
//     }
// })

router.get('/private_chat/:id/', async function (req, res, next){
  if(!req.headers['authorization']) {
    return res.sendStatus(401)
  }
  const params = req.params.id;
  let auth;
  try {
    auth = jwt.decode(req.headers['authorization'], config.secretkey);
  } catch (err) {
    return res.sendStatus(401)
  }
  try {
    const getUserChat = await datareader(Chat, params, 'findById');
    res.json(getUserChat);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.post('/new_private_chat/', async function (req, res, next) {
  let auth;
  if(!req.headers['authorization']) {
    return res.sendStatus(401)
  }
  try {
    auth = jwt.decode(req.headers['authorization'], config.secretkey);
  } catch (err) {
    return res.sendStatus(401)
  }
  const params = {
    $or: [
      {username: auth.username},
      {email: auth.username}
    ]
  };
  let chat = new Chat;
  chat.users = req.body.users;
  chat.email = req.body.email;
  chat.messages = [];
  chat.type = "private";
  chat.save(function (err) {
    if (err) { res.json(err)}
    else {
      let createdChat = new ChatData(chat);
      datareader(User, params, 'findOne')
       .then(response => {
        let user1 = '', user2 = '';
        for (let i=0; i<chat.users.length;i++) {
          user1 = chat.users[0];
          user2 = chat.users[1];
        }
        const updateUser1Params = {
          query: {"username" : user1, "contacts.id" : user2},
          objNew: {$set : { "contacts.$.private_chat" : createdChat.id }}
        };
        datareader(User, updateUser1Params, 'updateOne');
        const updateUser2Params = {
          query: {"username" : user2, "contacts.id" : user1},
          objNew: {$set : { "contacts.$.private_chat" : createdChat.id }}
        };
        datareader(User, updateUser2Params, 'updateOne');
        })
        .then(response => {
          res.json(createdChat);
        })
    }
  })
});

router.post('/deleteChat/', async function (req, res, next) {
  let auth;
  if(!req.headers['authorization']) {
    return res.sendStatus(401)
  }
  try {
    auth = jwt.decode(req.headers['authorization'], config.secretkey);
  } catch (err) {
    return res.sendStatus(401)
  }
  const dataObj = req.body;
  // dataObj = {
  //   myId: String,
  //   id: String;  
  // }
  const deleteChatParams = {
    query: {"username" : dataObj.myId, "contacts.id" : dataObj.id},
    objNew:{$set : { "contacts.$.private_chat" : null }} // как мы должны обозначить что пользователь удалил чат?
  };
  const params = {
    query: {username: dataObj.username},
    objNew: {$pull: {chats: {id: dataObj.chatUsername}}}
  };
  try {
    const deleteChat = await datareader(Chat, deleteChatParams, 'updateOne');
    console.log('deleteChat', deleteChat);
    const updateRes = await datareader(User, params, 'updateOne');
    console.log('updateRes', updateRes);
  } catch (err) {
    return res.sendStatus(500)
  }
  res.sendStatus(200);
})

module.exports = router;