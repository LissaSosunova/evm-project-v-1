export module SocketIO {
    export enum events {
        all_messages_counter = 'all_messages_counter',
        chats_model = 'chats_model',
        user_read_message = 'user_read_message',
        message = 'message',
        new_message = 'new_message',
        user = 'user',
        user_in_chat = 'user_in_chat',
        user_left_chat = 'user_left_chat',
        user_is_typing = 'user_is_typing',
        user_is_typing_notification = 'user_is_typing_notification',
        user_left = 'user_left',
        all_online_users = 'all_online_users'
    }
}
