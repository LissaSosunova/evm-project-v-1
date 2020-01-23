import * as jwt from 'jwt-simple';
import { datareader } from '../../modules/datareader';
import * as express from 'express';
import { Router } from 'express';
import { MongoActions } from '../../interfaces/mongo-actions';
import { Chat } from '../../models/chats';
import { User } from '../../models/user';
import { ChatData } from '../../modules/chatData';
import { ChatDb, UserDataObj, NewPrivateChatReq, Chats, CreateNewChatUser } from '../../interfaces/types';

export class NewPrivateChat {
    public router: Router;
    constructor(private express) {
        this.init();
    }

    private init(): void {
        this.router = this.express.Router();
        this.router.post('/new_private_chat/', async (req, res, next) => {
            let auth;
            if (!req.headers['authorization']) {
              return res.sendStatus(401);
            }
            try {
              auth = jwt.decode(req.headers['authorization'], req.headers['token_key'] as string);
            } catch (err) {
              return res.sendStatus(401);
            }
            const reqArr: NewPrivateChatReq = req.body;
            // Params for search in Chat DB (exist chat): req.body.users[0] - id autorisated user, а req.body.users[1] - id of second user
            const findChatParams = {
              $and: [{'users.username': reqArr.users[0].username}, {'users.username': reqArr.users[1].username}, {type: 1}]
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
                {username: reqArr.users[1].username},
                {email: reqArr.users[1].email}
              ]
            };
            try {
              /* findChat - try to find exist private chat
              If chat exist - add exist chat ID to contacts.$.private_chat (both users).
              If chat doesn't exist - create new chat and add to contacts.$.private_chat (both users).*/
              const findChat: ChatDb = await datareader(Chat, findChatParams, MongoActions.FIND_ONE);
              if (findChat == null) {
                // Create new private chat and add ID to users
                const chat = new Chat;
                chat.users = reqArr.users;
                chat.messages = [];
                chat.type = 1;
                const chatItem1 = {} as Chats;
                const response1: UserDataObj = await datareader(User, {username: reqArr.users[1].username}, MongoActions.FIND_ONE);
                chatItem1.id = reqArr.users[1].username;
                chatItem1.name = response1.name;
                chatItem1.users = reqArr.users;
                chatItem1.avatar = response1.avatar;
                chatItem1.chatId = chat.id;
                chatItem1.type = chat.type;
                // Create chat for second User
                const authParams = {
                  $or: [
                    {username: auth.username},
                    {email: auth.username}
                  ]
                };
                const chatItem2 = {} as Chats;
                const response2: UserDataObj = await datareader(User, authParams, MongoActions.FIND_ONE);
                chatItem2.id = response2.username;
                chatItem2.name = response2.name;
                chatItem2.users = req.body.users;
                chatItem2.avatar = response2.avatar;
                chatItem2.chatId = chat.id;
                chatItem2.type = chat.type;
                const updateParams = {
                  query: params,
                  objNew:  {$push: {chats: chatItem1}}};
                const updateChat = await datareader(User, updateParams, MongoActions.UPDATE_ONE);
                const updateParams2 = {
                  query: params2,
                  objNew:  {$push: {chats: chatItem2}}};
                const updateChat2 = await datareader(User, updateParams2, MongoActions.UPDATE_ONE);
                chat.save((err, data) => {
                  if (err) {
                    res.json(err);
                  } else {
                    const createdChat: ChatData = new ChatData(chat);
                    datareader(User, params, MongoActions.FIND_ONE)
                      .then(response => {
                        let user1: CreateNewChatUser;
                        let user2: CreateNewChatUser;
                        for (let i = 0; i < chat.users.length; i++) {
                          user1 = chat.users[0];
                          user2 = chat.users[1];
                        }
                        const updateUser1Params = {
                          query: {'username' : user1.username, 'contacts.id' : user2.username},
                          objNew: {$set : { 'contacts.$.private_chat' : createdChat.id }}
                        };
                        datareader(User, updateUser1Params, MongoActions.UPDATE_ONE);
                        const updateUser2Params = {
                          query: {'username' : user2.username, 'contacts.id' : user1.username},
                          objNew: {$set : { 'contacts.$.private_chat' : createdChat.id }}
                        };
                        datareader(User, updateUser2Params, MongoActions.UPDATE_ONE);
                        return res.json(chatItem1);
                      });
                  }
                });
              } else {
                // Add exist chat ID to contacts.$.private_chat (both users)
                const authParams = {
                  $or: [
                    {username: auth.username},
                    {email: auth.username}
                  ]
                };
                const response1: UserDataObj = await datareader(User, {username: reqArr.users[1].username}, MongoActions.FIND_ONE);
                const response2: UserDataObj = await datareader(User, authParams, MongoActions.FIND_ONE);
                const updateUser1Params = {
                  query: {'username' : response1.username, 'contacts.id' : response2.username},
                  objNew: {$set : { 'contacts.$.private_chat' : findChat._id }}
                };
                await datareader(User, updateUser1Params, MongoActions.UPDATE_ONE);
                const updateUser1ChatStatus = {
                  query: {'username' : response1.username, 'chats.id' : response2.username},
                  objNew: {$set : { 'chats.$.type': 1 }}
                };
                await datareader(User, updateUser1ChatStatus, MongoActions.UPDATE_ONE);
                const updateUser2Params = {
                  query: {'username' : response2.username, 'contacts.id' : response1.username},
                  objNew: {$set : { 'contacts.$.private_chat' : findChat._id }}
                };
                await datareader(User, updateUser2Params, MongoActions.UPDATE_ONE);
                const updateUser2ChatStatus = {
                  query: {'username' : response2.username, 'chats.id' : response1.username},
                  objNew: {$set : { 'chats.$.type': 1 }}
                };
                await datareader(User, updateUser2ChatStatus, MongoActions.UPDATE_ONE);
                // Add exist chat to array "chats" (both users)
                // Check in array "chats"
                const checkUser1ChatsParams = {'username' : response1.username, 'chats.chatId' : findChat._id};
                const checkUser2ChatsParams = {'username' : response2.username, 'chats.chatId' : findChat._id};
                // User 1
                const resultFindChatUser1: UserDataObj = await datareader(User, checkUser1ChatsParams, MongoActions.FIND_ONE);
                if (!resultFindChatUser1) {
                  const chatItem1 = {} as Chats;
                  chatItem1.id = response2.username;
                  chatItem1.name = response2.name;
                  chatItem1.users = req.body.users;
                  chatItem1.avatar = response2.avatar;
                  chatItem1.chatId = findChat._id;
                  chatItem1.type = 1;
                  const updateParams = {
                    query: params2,
                    objNew:  {$push: {chats: chatItem1}}};
                  const updateChat = await datareader(User, updateParams, MongoActions.UPDATE_ONE);
                }
                // User 2
                const resultFindChatUser2: UserDataObj = await datareader(User, checkUser2ChatsParams, MongoActions.FIND_ONE);
                const chatItem2 = {} as Chats;
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
                  const updateChat = await datareader(User, updateParams2, MongoActions.UPDATE_ONE);
                }
                return res.json(chatItem2);
              }
            } catch (error) {
              console.error('/new_private_chat', error);
              res.status(500).json({error});
            }
        });
    }
}
