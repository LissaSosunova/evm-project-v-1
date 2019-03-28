import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { types } from '../types/types';
import { Socket } from 'dgram';
import { Subject, Observable } from 'rxjs';
import { SocketIO} from 'src/app/types/socket.io.types';

@Injectable({
  providedIn: 'root'
})

export class SocketIoService {

  // public events = {
  //   all_messages_counter: 'all_messages_counter',
  //   chats_model: 'chats_model',
  //   user_read_message: 'user_read_message',
  //   message: 'message',
  //   user: 'user',
  //   user_in_chat: 'user_in_chat',
  //   user_left_chat: 'user_left_chat',
  //   user_is_typing: 'user_is_typing',
  //   user_left: 'user_left',
  //   all_online_users: 'all_online_users'
  // };

  private socketInstance: SocketIOClient.Socket;
  private currentTrackedMessages = {};
  private socketMessageBus: Subject<types.SocketMessage> = new Subject<types.SocketMessage>();

  constructor() { }

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

  public socketConnect(): void {
    if (this.socketInstance) {
      this.socketInstance.off('reconnect');
      this.socketInstance.off('connect');
      this.socketInstance.close();
    }
    this.socketInstance = io(this.getURI(), { reconnection: true });
    this.socketInstance.on('reconnect', this.onSocketReconnect.bind(this));
    this.socketInstance.on('connect', this.onSocketReconnect.bind(this));
  }

  public socketEmitCallback(event: string, data: any, cbFunction: Function): void {
    this.socketInstance.emit(event, data, cbFunction);
  }

  public socketEmit(event: SocketIO.events, data: any): void {
    this.socketInstance.emit(event, data);
  }

  private getURI(): string {
    return types.getURI();
  }

  private async onSocketReconnect(): Promise<void> {
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
