import * as socketIo from 'socket.io';
import { ClientsInChat, OnlineClients, TokenObj, UserIdObj } from '../interfaces/types';

export class StoreService {
    private _onlineClients: OnlineClients = {};
    private _clientsInChat: ClientsInChat = {};

    public setOnlineClient(id: string, token: string, socket: socketIo.Socket): void {
        if (!this._onlineClients[id]) {
            this._onlineClients[id] = {};
        }
        this._onlineClients[id][token] = socket;
    }

    public getOnlineClients(id: string): TokenObj {
        if (this._onlineClients[id]) {
            return this._onlineClients[id];
        }
    }

    public get allOnlineClients(): OnlineClients {
        return this._onlineClients;
    }

    public get allClientsInChat(): ClientsInChat {
        return this._clientsInChat;
    }

    public deleteOnlineClients(id: string, token: string): void {
        if (this._onlineClients[id] && this._onlineClients[id][token]) {
            delete this._onlineClients[id][token];
        }
        if (this._onlineClients[id] && Object.keys(this._onlineClients[id]).length === 0) {
            delete this._onlineClients[id];
          }
    }

    public setClientsInChat(chatId: string, id: string, token: string, socket: socketIo.Socket): void {
        if (!this._clientsInChat[chatId]) {
            this._clientsInChat[chatId] = {};
        }
        if (!this._clientsInChat[chatId][id]) {
            this._clientsInChat[chatId][id] = {};
        }
        this._clientsInChat[chatId][id][token] = socket;
    }

    public getClientsInChat(chatId: string): UserIdObj {
        if (this._clientsInChat[chatId]) {
            return this._clientsInChat[chatId];
        }
    }

    public deleteClientInChat(chatId: string, id: string, token: string): void {
        if (this._clientsInChat[chatId] && this._clientsInChat[chatId][id] && this._clientsInChat[chatId][id][token]) {
            delete this._clientsInChat[chatId][id][token];
        }
        if (this._clientsInChat[chatId] &&
            this._clientsInChat[chatId][id] &&
            Object.keys(this._clientsInChat[chatId][id]).length === 0) {
            delete this._clientsInChat[chatId][id];
        }
        if (this._clientsInChat[chatId] && Object.keys(this._clientsInChat[chatId] && this._clientsInChat[chatId]).length === 0) {
            delete this._clientsInChat[chatId];
        }
    }
}
