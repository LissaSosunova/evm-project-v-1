import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { types } from '../types/types';
import { Subject, Observable } from 'rxjs';
import { SocketIO} from 'src/app/types/socket.io.types';
import { environment } from 'src/environments/environment';
import { CookieService } from '../core/services/cookie.service';

@Injectable({
  providedIn: 'root'
})

export class SocketIoService {

  private socketInstance: SocketIOClient.Socket;
  private currentTrackedMessages = {};
  private socketMessageBus: Subject<types.SocketMessage> = new Subject<types.SocketMessage>();
  private chatId: string;

  constructor(private cookieService: CookieService) { }


  public set setChatId(chatId: string) {
    this.chatId = chatId;
  }

  public get getChatId(): string {
    return this.chatId;
  }

  public deleteChatId(chatId: string): void {
    if (this.chatId === chatId) {
      this.chatId = null;
    }
  }

  public on(msgName: SocketIO.events): Observable<any> {
    this.addToTrackedMessages(msgName);
    return new Observable(observer => {
        const sub = this.socketMessageBus.subscribe(msg => {
          if (msg.name === msgName) {
            observer.next(msg.payload);
          }
        });

        return () => {
          sub.unsubscribe();
          this.removeFromTrackedMessages(msgName);
        };
    });
  }

  public closeConnection() {
    if (this.socketInstance) {
      this.socketInstance.close();
    }
  }

  public send(msgName: SocketIO.events, payload: any): void {
    if (this.socketInstance) {
      this.socketInstance.send(msgName, payload);
    }
  }

  public socketConnect(username: string): void {
    if (this.socketInstance) {
      this.socketInstance.off('reconnect');
      this.socketInstance.off('connect');
      this.socketInstance.close();
    }
    this.socketInstance = io(this.getURI(), {
      reconnection: true,
      query: {
        token: this.cookieService.getCookie('access_token'),
        token_key: this.cookieService.getCookie('token_key')
      }
    });
    this.socketInstance.on('reconnect', this.onSocketReconnect.bind(this, username));
    this.socketInstance.on('connect', this.onSocketReconnect.bind(this, username));
  }

  public socketEmitCallback(event: SocketIO.events, data: any, cbFunction: Function): void {
    this.socketInstance.emit(event, data, cbFunction);
  }

  public socketEmit(event: SocketIO.events, data: any): void {
    this.socketInstance.emit(event, data);
  }

  private getURI(): string {
    return environment.backendURI;
  }

  private async onSocketReconnect(username: string): Promise<void> {
    const token = this.cookieService.getCookie('access_token');
    const dataObj = {
      userId: username,
      token: token
    };
    this.socketEmit(SocketIO.events.user, dataObj);
    if (this.chatId) {
      const data = {
        userId: username,
        token: token,
        chatIdCurr: this.chatId
      };
      this.socketEmit(SocketIO.events.user_in_chat, data);
    }
    if (this.socketInstance) {
      Object.keys(this.currentTrackedMessages).forEach((msgName: SocketIO.events) => {
          if (this.currentTrackedMessages[msgName] > 0) {
            this.socketInstance.on(msgName, (payload) => {
              this.socketMessageBus.next({
                name: msgName,
                payload
              });
            });
          }
      });
    }
  }

  private addToTrackedMessages(name: SocketIO.events): void {
    if (this.currentTrackedMessages[name] === undefined) {
      this.currentTrackedMessages[name] = 0;
      if (this.socketInstance) {
        this.socketInstance.on(name, (payload) => {
            this.socketMessageBus.next({
              name,
              payload
            });
        });
      }
    }
    this.currentTrackedMessages[name]++;
}

  private removeFromTrackedMessages(name: SocketIO.events): void {
    if (this.currentTrackedMessages[name]) {
      this.currentTrackedMessages[name]--;
      if (this.currentTrackedMessages[name] === 0) {
        delete this.currentTrackedMessages[name];
        if (this.socketInstance) {
          this.socketInstance.off(name);
        }
      }
    }
  }

}
