import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import { NewGroupChatPopupComponent } from './new-group-chat-popup/new-group-chat-popup.component';
import { MainApiService } from '../../services/main.api.service';

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

  constructor(private mainApiService: MainApiService,
              private route: ActivatedRoute,
              private router: Router,
              private store: Store<types.User>
              ) { }


  ngOnInit() {
    this.init();
  }

  ngOnDestroy () {
    this.newGroupChatPopup.onClose();
  }

  public getChat(chatId: string): void {
    const data = {
      queryNum: `0`,
      queryMessagesAmount: String(types.Defaults.QUERY_MESSAGES_AMOUNT),
      messagesShift: `0`
    };
    this.mainApiService.getRequest(`/chat/private_chat/${chatId}`, data)
    .subscribe(
      response => {
  
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
