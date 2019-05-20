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

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})

export class ChatWindowComponent implements OnInit, OnDestroy {
  public arrayOfMessages: Array<types.Message> = [];
  public blockedChats: Array<types.Chats> = [];
  public chats: types.Chats;
  public control: FormControl;
  public deletedChats: Array<types.Chats> = [];
  public draftMessage: any[];
  public groupChats: Array<types.Chats> = [];
  public inputMes: string;
  public isDraftMessageExist: boolean;
  public isDraftMessageSent: boolean = false;
  public isMessages: boolean = false;
  public privateChats:Array<types.Chats> = [];
  public test: String = 'This is test data';
  public user: types.User = {} as types.User;

  private chatId: string;
  private unsubscribe$: Subject<void> = new Subject<void>();
  constructor(private transferService: TransferService,
              private route: ActivatedRoute,
              private router: Router,
              private data: DataService,
              private dateTransformService: DateTransformService,
              private socketIoService: SocketIoService) { }

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
  }

  public init(): void {
    this.socketIoService.on(SocketIO.events.new_message).pipe(takeUntil(this.unsubscribe$))
    .subscribe(message => {
      console.log(message);
    });
    this.chatId = this.route.snapshot.params.chatId;
    this.getChat(this.chatId); // вынеси в резолвер
    this.user = this.transferService.dataGet('userData');
    this.draftMessage = this.route.snapshot.data.draftMessage;
    let draftMessageItem: types.DraftMessage;
    if (this.draftMessage && this.draftMessage.length > 0) {
      draftMessageItem = this.draftMessage[0].draftMessages.find(item => {
        return item.authorId === this.user.username;
      });
    }
    // console.log('draftMessageItem', draftMessageItem);
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

  public getChat(id: string): void {
    this.data.getPrivatChat(id, '0').subscribe(
      response => {
        console.log('messages', response);
        if(response.length <=0){
          this.test = 'There are no messages in this chat.';
          console.log(this.test);
        } else {
          this.isMessages = true;
          this.arrayOfMessages = response;
          console.log('messages', response);
        }
        
      }
    );
  }


  public sendMessage(): void {
    const date = this.dateTransformService.nowUTC();
    const message: types.Message = {
      chatID: this.chatId,
      text: this.inputMes,
      date: date,
      edited: false,
      authorId: this.user.username
    };
    // if (this.isDraftMessageSent) {
    //   this.deleteDraftMessage();
    //   this.isDraftMessageSent = false;
    // }
    this.data.sendMessage(message).subscribe(
      chatBody => {
        this.arrayOfMessages = chatBody.messages;
        console.log(chatBody);
      }
    )
    console.log(message);
    // this.socketIoService.socketEmitCallback(SocketIO.events.message, message, this.sendMessageCallback);
    this.inputMes = '';
    this.control.setValue('');
  }

  private sendMessageCallback(): void {
    console.log('event');
  }

  private deleteDraftMessage(): void {
    const draftMessageDeleteObj: types.DraftMessageDeleteObj = {
      chatID: this.chatId,
      authorId: this.user.username
    };
    console.log('delete draft message', draftMessageDeleteObj);
    this.data.deleteDraftMessage(draftMessageDeleteObj).subscribe(res => {
     console.log(res);
     this.isDraftMessageExist = false;
    });
  }

  private sendDraftMessage(): void {
    const date = this.dateTransformService.nowUTC();
    const draftMessage: types.DraftMessage = {
      chatID: this.chatId,
      text: this.inputMes,
      date: date,
      authorId: this.user.username
    };
    console.log('draft message sent', draftMessage);
    this.data.sendDraftMessage(draftMessage).subscribe(res => {
     console.log(res);
     this.isDraftMessageSent = true;
    });
  }

}
