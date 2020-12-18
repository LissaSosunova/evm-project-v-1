import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { DataService } from 'src/app/services/data.service';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import { NewGroupChatPopupComponent } from './new-group-chat-popup/new-group-chat-popup.component';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit, OnDestroy {
  public blockedChats: Array<types.Chats> = [];
  public chats: any;
  public deletedChats: Array<types.Chats> = [];
  public groupChats: Array<types.Chats> = [];
  public inputMes: string;
  public privateChats: Array<types.Chats> = [];
  public user: types.User = {} as types.User;
  public user$: Observable<types.User>;

  @ViewChild('newGroupChatPopup', {static: true}) private newGroupChatPopup: NewGroupChatPopupComponent;

  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private data: DataService,
              private store: Store<types.User>
              ) { }


  ngOnInit() {
    this.init();
  }

  ngOnDestroy () {
    this.newGroupChatPopup.onClose();
  }

  public getChat(id: string): void {
    this.data.getPrivatChat(id, '0', String(types.Defaults.QUERY_MESSAGES_AMOUNT), '0').subscribe(
      response => {
        console.log(response);
      }
    );
  }

  public newGroupChat(): void {
    this.newGroupChatPopup.open();
  }

  private init(): void {
    this.user$ = this.store.select('user');
  }

}
