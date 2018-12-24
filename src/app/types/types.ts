export module types {
  export interface login {
  username: string;
  password: string;
  }
  export interface loginResp {
    success: boolean;
    access_token: string;
  }
  export interface registration {
    username: string;
    email: string;
    password: string;
  }
  export interface user {
    username: string,
    email: string,
    name: string,
    phone: string,
    contacts: [ object ],
    events: [ object ],
    chats: [ object ],
    avatar: object,
    notifications: [ object ]
  }
}
