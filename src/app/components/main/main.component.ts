import { Component, OnInit, OnDestroy } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { ActivatedRoute, Router, RouterOutlet, NavigationStart } from '@angular/router';
import { TransferService } from 'src/app/services/transfer.service';
import { types } from 'src/app/types/types';
import { DataService } from 'src/app/services/data.service';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { SessionStorageService } from 'src/app/services/session.storage.service';
import { SocketIO} from 'src/app/types/socket.io.types';
import { Store, select } from '@ngrx/store';
import * as userAction from  '../../store/actions';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit, OnDestroy {

  public user: types.User = {} as types.User;
  private unsubscribe$: Subject<void> = new Subject();

  constructor(private route: ActivatedRoute,
    public router: Router,
    private data: DataService,
    private transferService: TransferService,
    private socketIoService: SocketIoService,
    private sessionStorageService: SessionStorageService,
              private store: Store<types.User>) {
    }

  ngOnInit() {
    this.user = this.route.snapshot.data.userData; // используем резолвер для получения данных пользователя
    this.store.dispatch(new userAction.InitUserModel(this.user));
    this.transferService.dataSet({name: 'userData', data: this.user});
    const token = this.sessionStorageService.getValue('_token');
    this.socketIoService.socketConnect();
    const dataObj = {
      userId: this.user.username,
      token: token
    };
    this.socketIoService.socketEmit(SocketIO.events.user, dataObj);
    this.socketIoService.on(SocketIO.events.chats_model).pipe(takeUntil(this.unsubscribe$))
      .subscribe(message => {
        this.store.dispatch(new userAction.UpdateChatList(message));
      });
  }

  ngOnDestroy() {
    this.socketIoService.closeConnection();
    sessionStorage.clear();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
