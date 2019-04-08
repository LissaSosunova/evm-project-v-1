import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { TransferService } from 'src/app/services/transfer.service';
import { EventEmitter } from 'protractor';
import { DataService } from 'src/app/services/data.service';
import { ChatListComponent } from './chat-list/chat-list.component';
import { FormControl, Validators } from '@angular/forms';
import { DateTransformService } from 'src/app/services/date-transform.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

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
  public privateChats:Array<types.Chats> = [];
  public test: String = 'This is test data';
  public user: types.User = {} as types.User;
  public control: FormControl;
  public isDraftMessageSent: boolean = false;
  public draftMessage: types.DraftMessage;

  private subscriptions: Subscription[] = [];
  constructor(private transferService: TransferService,
              private route: ActivatedRoute,
              private router: Router,
              private dateTransformService: DateTransformService,
              private data: DataService
              ) { }


  ngOnInit() {
    this.init();
  }

  ngOnDestroy () {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    if (this.inputMes) {
      this.sendDraftMessage();
    }
    
  }
  public init(): void {
    const user = this.transferService.dataGet('userData');
    this.user = Object.assign({}, user);
    this.transferService.setDataObs(this.test);

  }

  public getChat(id: string): void {
    // const id = window.location.href.toString().split("/chat-window/")[1];
    this.data.getPrivatChat(id).subscribe(
      response => {
        console.log(response);
      }
    )
    // this.draftMessage = this.route.snapshot.data.draftMessage;
    // if (this.draftMessage && Object.keys(this.draftMessage).length > 0) {
    //  this.control = new FormControl(this.draftMessage.text, Validators.required);
    // } else {
    //  this.control = new FormControl('', Validators.required);
    // }

    this.control = new FormControl('', Validators.required);
    this.user = Object.assign({}, user);
    this.transferService.setDataObs(this.test);
    const subscription: Subscription = this.control.valueChanges.subscribe(message => {
      this.inputMes = message;
    });
    this.subscriptions.push(subscription);
    const subForSendingDraftMes: Subscription = this.control.valueChanges
    .pipe(debounceTime(2000), distinctUntilChanged())
    .subscribe(message => {
      if (message) {
        this.sendDraftMessage();
        this.isDraftMessageSent = true;
      } else if (!message && this.isDraftMessageSent) {
        this.deleteDraftMessage();
        this.isDraftMessageSent = false;
      }
    })
    this.subscriptions.push(subForSendingDraftMes);
  }

  public sendMessage(): void {
    const date = this.dateTransformService.nowUTC();
    const draftMessage: types.DraftMessage = {
      chatID: 'qwert', // mocked
      text: this.inputMes,
      date: date,
      authorId: this.user.username
    };
    if (this.isDraftMessageSent) {
      this.deleteDraftMessage();
      this.isDraftMessageSent = false;
    }
    console.log(draftMessage);
    this.inputMes = '';
    this.control.setValue('');
  }

  private sendDraftMessage(): void {
    const date = this.dateTransformService.nowUTC();
    const draftMessage: types.DraftMessage = {
      chatID: 'qwert', // mocked
      text: this.inputMes,
      date: date,
      authorId: this.user.username
    };
    console.log('draft message sent', draftMessage);
    //const sub = this.data.sendDraftMessage(draftMessage).subscribe(res => {
    //  console.log(res);
    //  sub.unsubscribe();
    //});
  }

  private deleteDraftMessage(): void {
    const draftMessageDeleteObj: types.DraftMessageDeleteObj = {
      chatID: 'chatId mocked',
      authorId: this.user.username
    }
    console.log('delete draft message',draftMessageDeleteObj);
    //const sub = this.data.deleteDraftMessage(draftMessageDeleteObj).subscribe(res => {
    //  console.log(res);
    //  sub.unsubscribe();
    //});
  }

  

}
