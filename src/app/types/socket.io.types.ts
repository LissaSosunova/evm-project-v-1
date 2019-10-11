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
        message_out_of_chat = 'message_out_of_chat',
        user_left = 'user_left',
        all_online_users = 'all_online_users',
        delete_message = 'delete_message',
        edit_message = 'edit_message',
        delete_message_out_of_chat = 'delete_message_out_of_chat',
        add_user = 'add_user',
        add_user_request = 'add_user_request',
        confirm_user = 'confirm_user',
        confirm_user_request = 'confirm_user_request',
        delete_contact = 'delete_contact',
        reject_request = 'reject_request',
        delete_request = 'delete_request',
        new_event = 'new_event',
        new_event_confirm = 'new_event_confirm'
    }
}
