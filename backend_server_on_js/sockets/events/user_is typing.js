function userIsTyping(socket, clientsInChat) {
    socket.on("user_is_typing", obj => {
        /**
         obj = {
        userId: string;
        name: string;
        users: string[];
        chatId: string;
        typing: boolean
        }
         */

        if(clientsInChat[obj.chatId]) {
          Object.keys(clientsInChat[obj.chatId]).forEach(userId => {
            Object.keys(clientsInChat[obj.chatId][userId]).forEach(token => {
              if (obj.userId !== userId) {
                clientsInChat[obj.chatId][userId][token].emit('user_is_typing', obj);
              }
            })
          })
        }
      });

}

module.exports = userIsTyping;