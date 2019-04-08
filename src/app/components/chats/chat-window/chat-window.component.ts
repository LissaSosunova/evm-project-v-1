<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { TransferService } from 'src/app/services/transfer.service';
import { DataService } from 'src/app/services/data.service';
=======
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { types } from 'src/app/types/types';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DateTransformService } from 'src/app/services/date-transform.service';
import { TransferService } from 'src/app/services/transfer.service';
>>>>>>> draft messages

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
<<<<<<< HEAD
export class ChatWindowComponent implements OnInit {
  public blockedChats: Array<types.Chats> = [];
  public chats: types.Chats;
  public deletedChats: Array<types.Chats> = [];
  public groupChats: Array<types.Chats> = [];
  public inputMes: string;
  public privateChats:Array<types.Chats> = [];
  public test: String = 'This is test data';
  public user: types.User = {} as types.User;
  private chatId: string;
  constructor(private transferService: TransferService,
              private route: ActivatedRoute,
              private router: Router,
              private data: DataService) { }

  ngOnInit() {
    this.init();

  }

  ngOnDestroy () {

  }
  public init(): void {
    const user = this.transferService.dataGet('userData');
    this.user = Object.assign({}, user);
    this.transferService.setDataObs(this.test);
    const id = window.location.href.toString().split("/chat-window/")[1];
    this.getChat(id);

  }

  public getChat(id: string): void {
    // const id = window.location.href.toString().split("/chat-window/")[1];
    this.data.getPrivatChat(id).subscribe(
      response => {
        console.log(response);
      }
    )
  }
=======
export class ChatWindowComponent implements OnInit, OnDestroy {

  public inputMes: string;
  public control: FormControl;
  public isDraftMessageSent: boolean = false;
  public draftMessage: types.DraftMessage;
  public user: types.User;

   private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private dateTransformService: DateTransformService,
              private transferService: TransferService,) { }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy () {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    if (this.inputMes) {
      this.sendDraftMessage();
    }
    
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

  private init(): void {
    this.user = this.transferService.dataGet('userData');
    this.draftMessage = this.route.snapshot.data.draftMessage;
    if (this.draftMessage && Object.keys(this.draftMessage).length > 0) {
      this.control = new FormControl(this.draftMessage.text, Validators.required);
    } else {
      this.control = new FormControl('', Validators.required);
    }

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

>>>>>>> draft messages
}
