import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { TransferService } from 'src/app/services/transfer.service';
import { DataService } from 'src/app/services/data.service';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DateTransformService } from 'src/app/services/date-transform.service';
import { Subject } from 'rxjs';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { SocketIO} from 'src/app/types/socket.io.types';
import { SessionStorageService } from 'src/app/services/session.storage.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})

export class ChatWindowComponent implements OnInit, OnDestroy {
  public arrayOfMessages: Array<types.Message> = [];
  public blockedChats: Array<types.Chats> = [];
  public control: FormControl;
  public deletedChats: Array<types.Chats> = [];
  public draftMessage: any[];
  public groupChats: Array<types.Chats> = [];
  public inputMes: string;
  public isDraftMessageExist: boolean;
  public isDraftMessageSent: boolean = false;
  public isMessages: boolean = false;
  public privateChats: Array<types.Chats> = [];
  public test: String = 'This is test data';
  public user: types.User = {} as types.User;

  private chats: types.ChatData;
  private chatId: string;
  private userObj: {chatIdCurr: string; userId: string; token: string};
  private unsubscribe$: Subject<void> = new Subject<void>();
  constructor(private transferService: TransferService,
              private route: ActivatedRoute,
              private router: Router,
              private data: DataService,
              private dateTransformService: DateTransformService,
              private socketIoService: SocketIoService,
              private sessionStorageService: SessionStorageService) { }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy () {
    if (this.inputMes) {
      this.sendDraftMessage();
    } else if (this.isDraftMessageSent && this.inputMes === '') {
      this.deleteDraftMessage();
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.socketIoService.socketEmit(SocketIO.events.user_left_chat, this.userObj);
  }

  public sendMessage(): void {
    const date = this.dateTransformService.nowUTC();
    const message: types.Message = {
      chatID: this.chatId,
      text: this.inputMes,
      users: this.chats.users,
      unread: [],
      date: date,
      edited: false,
      authorId: this.user.username
    };
    if (this.isDraftMessageSent) {
       this.deleteDraftMessage();
       this.isDraftMessageSent = false;
     }
    console.log(message);
    this.socketIoService.socketEmit(SocketIO.events.message, message);
    this.inputMes = '';
    this.control.setValue('');
  }

  private getChat(): void {
    this.chats = this.route.snapshot.data.chatMessages;
    this.arrayOfMessages = this.chats.messages;
    if (this.arrayOfMessages.length <= 0) {
      this.test = 'There are no messages in this chat.';
      console.log(this.test);
    } else {
      this.isMessages = true;
      console.log('messages', this.arrayOfMessages);
    }
  }

  private init(): void {
    this.user = this.transferService.dataGet('userData');
    this.chatId = this.route.snapshot.params.chatId;
    this.subscribeNewMessagesInit();
    this.userObj = {
      chatIdCurr: this.chatId,
      userId: this.user.username,
      token: this.sessionStorageService.getValue('_token')
  };
    this.socketIoService.socketEmit(SocketIO.events.user_in_chat, this.userObj);
    this.getChat();
    this.initDraftMessagesSubscription();
  }


  private deleteDraftMessage(): void {
    const draftMessageDeleteObj: types.DraftMessageDeleteObj = {
      chatID: this.chatId,
      authorId: this.user.username
    };
    this.data.deleteDraftMessage(draftMessageDeleteObj).subscribe(res => {
     this.isDraftMessageExist = false;
    });
  }

  private initDraftMessagesSubscription(): void {
    this.draftMessage = this.route.snapshot.data.draftMessage;
    let draftMessageItem: types.DraftMessage;
    if (this.draftMessage && this.draftMessage.length > 0) {
      draftMessageItem = this.draftMessage[0].draftMessages.find(item => {
        return item.authorId === this.user.username;
      });
    }
    this.isDraftMessageExist = !!draftMessageItem;

    if (this.isDraftMessageExist) {
      this.control = new FormControl(draftMessageItem.text, Validators.required);
      this.isDraftMessageSent = true;
    } else {
      this.control = new FormControl('', Validators.required);
    }

    this.control.valueChanges.pipe(takeUntil(this.unsubscribe$))
    .subscribe(message => {
      this.inputMes = message;
    });

    this.control.valueChanges
    .pipe(debounceTime(2000), distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe(message => {
      if (message) {
        this.sendDraftMessage();
        this.isDraftMessageSent = true;
      } else if (!message && this.isDraftMessageSent) {
        this.deleteDraftMessage();
        this.isDraftMessageSent = false;
      }
    });
  }

  private getMessages(chatId: string, n: number): void {
    // метод для получения последующих порций сообщений, будет вызываться при скроле окна до верха
    this.data.getPrivatChat(chatId, String(n)).subscribe(
      response => {
        console.log('messages', response);
      }
    );
  }

  private sendDraftMessage(): void {
    const date = this.dateTransformService.nowUTC();
    const draftMessage: types.DraftMessage = {
      chatID: this.chatId,
      text: this.inputMes,
      date: date,
      authorId: this.user.username
    };
    this.data.sendDraftMessage(draftMessage).subscribe(res => {
     this.isDraftMessageSent = true;
    });
  }

  private subscribeNewMessagesInit(): void {
    this.socketIoService.on(SocketIO.events.new_message).
    pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe(message => {
      console.log(message);
      // тут будет логика обновления модели для сообщений как своих, так и входящих
    });
 }
}
