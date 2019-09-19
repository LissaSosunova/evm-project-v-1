import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { types } from "src/app/types/types";
import { TransferService } from "src/app/services/transfer.service";
import { DataService } from "src/app/services/data.service";
import { FormControl, Validators } from "@angular/forms";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  takeUntil
} from "rxjs/operators";
import { DateTransformService } from "src/app/services/date-transform.service";
import { Observable, Subject } from "rxjs";
import { SocketIoService } from "src/app/services/socket.io.service";
import { SocketIO } from "src/app/types/socket.io.types";
import { SessionStorageService } from "src/app/services/session.storage.service";
import { select, Store } from "@ngrx/store";
import * as userAction from "../../../store/actions";
import { PageMaskService } from "src/app/services/page-mask.service";

@Component({
  selector: "app-chat-window",
  templateUrl: "./chat-window.component.html",
  styleUrls: ["./chat-window.component.scss"]
})
export class ChatWindowComponent implements OnInit, AfterViewInit, OnDestroy {
  public arrayOfMessages: Array<types.Message> = [];
  public arrayOfUsers: any[];
  public blockedChats: Array<types.Chats> = [];
  public control: FormControl;
  public deletedChats: Array<types.Chats> = [];
  public draftMessage: any[];
  public groupChats: Array<types.Chats> = [];
  public editMessageMode: boolean = false;
  public inputMes: string;
  public isDraftMessageExist: boolean;
  public isDraftMessageSent: boolean = false;
  public isLoadingMessages: boolean;
  public isMessages: boolean = false;
  public isSendBtn: boolean = true;
  public moreMessages: boolean = false;
  public portionMessagesNumber: number;
  public privateChats: Array<types.Chats> = [];
  public showArrowDown: boolean = false;
  public showUserIsTyping: boolean;
  public test: string;
  public user: types.User = {} as types.User;
  public userNameIsTyping: string;

  @ViewChild('messageBox', { static: true }) private messageBox: ElementRef;
  private messageBoxElement: HTMLDivElement;
  @ViewChild('footer', { static: true }) private footer: ElementRef;
  private footerElement: HTMLDivElement;
  @ViewChild('arrowDown', { static: true }) public arrowDown: ElementRef;
  private arrowDownElement: HTMLDivElement;
  @ViewChild('menuBlock', { static: true }) private menuBlock: ElementRef;
  private menuBlockElement: HTMLDivElement;

  private chats: types.ChatData;
  private chatId: string;

  private messagesShift: number = 0;
  private userObj: { chatIdCurr: string; userId: string; token: string };
  private isUserTyping: boolean = false;
  private unsubscribe$: Subject<void> = new Subject<void>();
  private user$: Observable<types.User>;
  private editedMessage: types.Message;

  constructor(
    private transferService: TransferService,
    private route: ActivatedRoute,
    private router: Router,
    private data: DataService,
    private dateTransformService: DateTransformService,
    private socketIoService: SocketIoService,
    private sessionStorageService: SessionStorageService,
    private pageMaskService: PageMaskService,
    private store: Store<types.User>
  ) {}

  ngOnInit() {
    this.init();
  }

  ngAfterViewInit() {
    this.afterViewInit();
  }

  ngOnDestroy() {
    this.destroy();
  }

  @HostListener('scroll', ['$event']) public scrollChatWindow(event) {
    const scrolled: number = this.messageBoxElement.scrollTop;
    const clientHeightChatWindow: number = this.messageBoxElement.clientHeight;
    const chatWindowsSrollHeight: number = this.messageBoxElement.scrollHeight;
    this.arrowDownElement.style.top = `${clientHeightChatWindow +
      scrolled -
      50}px`;
    if (scrolled < chatWindowsSrollHeight - 2 * clientHeightChatWindow) {
      this.showArrowDown = true;
    } else {
      this.showArrowDown = false;
    }
    if (this.portionMessagesNumber && scrolled === 0 && this.moreMessages) {
      this.getMessages(
        this.chatId,
        this.portionMessagesNumber,
        types.Defaults.QUERY_MESSAGES_AMOUNT,
        this.messagesShift
      );
    }
  }

  public cancelEditing(): void {
    this.editMessageMode = false;
    this.control.setValue(' ');
    this.inputMes = '';
    this.isSendBtn = true;
    setTimeout(() => {
      this.changeChatWindowHeigth();
      this.control.setValue('');
    });
  }

  public clickOutsideMenuBlock(): void {
    this.menuBlockElement.classList.add('hidden');
    this.pageMaskService.close();
  }

  public completeEditing(): void {
    if (this.user.username !== this.editedMessage.authorId) {
      return;
    }
    const editedMessageObj = {
      text: this.inputMes,
      chatId: this.editedMessage.chatID,
      userId: this.user.username,
      authorId: this.editedMessage.authorId,
      messageId: this.editedMessage._id
    };
    this.socketIoService.socketEmit(
      SocketIO.events.edit_message,
      editedMessageObj
    );
    this.cancelEditing();
  }

  public deleteMessage(message: types.Message): void {
    if (this.user.username !== message.authorId) {
      return;
    }
    const deleteMessageObj = {
      userId: this.user.username,
      authorId: message.authorId,
      messageId: message._id,
      chatId: message.chatID,
      unread: message.unread
    };
    this.socketIoService.socketEmit(
      SocketIO.events.delete_message,
      deleteMessageObj
    );
  }

  public editMessage(message: types.Message): void {
    this.editMessageMode = true;
    this.control.setValue(message.text);
    this.editedMessage = message;
    const documentWidth: number = document.documentElement.clientWidth;
    if (documentWidth < 380) {
      this.isSendBtn = false;
    }
    setTimeout(() => {
      this.changeChatWindowHeigth();
    });
  }

  public sendMessage(): void {
    this.isMessages = true;
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
    this.socketIoService.socketEmit(SocketIO.events.message, message);
    this.inputMes = '';
    this.control.setValue('');
    this.scrollDownMessageWindow();
  }

  public showChatLists(): void {
    this.menuBlockElement.classList.toggle('hidden');
    if (this.menuBlockElement.classList.contains('hidden')) {
      this.pageMaskService.close();
    } else {
      this.pageMaskService.open();
    }
  }

  private afterViewInit(): void {
    this.messageBoxElement = this.messageBox.nativeElement as HTMLDivElement;
    this.footerElement = this.footer.nativeElement as HTMLDivElement;
    this.arrowDownElement = this.arrowDown.nativeElement as HTMLDivElement;
    this.menuBlockElement = this.menuBlock.nativeElement as HTMLDivElement;
    this.scrollDownMessageWindow();
  }

  private changeChatWindowHeigth(): void {
    const footerHeigth: number = this.footerElement.clientHeight;
    this.messageBoxElement.style.maxHeight = `calc(100vh - ${footerHeigth}px - 120px)`;
  }

  private getChat(): void {
    this.chats = this.route.snapshot.data.chatMessages;
    this.arrayOfMessages = this.chats.messages;
    this.arrayOfUsers = this.chats.users;
    if (this.arrayOfMessages && this.arrayOfMessages.length <= 0) {
      this.test = 'There are no messages in this chat.';
    } else {
      this.isMessages = true;
      if (this.arrayOfMessages && this.arrayOfMessages.length >= 20) {
        this.portionMessagesNumber = 1;
        this.moreMessages = true;
      }
    }
  }

  private destroy(): void {
    this.socketIoService.socketEmit(
      SocketIO.events.user_left_chat,
      this.userObj
    );
    if (this.inputMes && !this.editMessageMode) {
      this.sendDraftMessage();
    } else if (this.isDraftMessageSent && this.inputMes === '') {
      this.deleteDraftMessage();
    }

    if (this.isUserTyping) {
      const userIsTypingObj: types.UserIsTyping = {
        userId: this.user.username,
        name: this.user.name,
        users: this.chats.users,
        chatId: this.chatId,
        typing: false
      };
      this.socketIoService.socketEmit(
        SocketIO.events.user_is_typing,
        userIsTypingObj
      );
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private init(): void {
    this.user$ = this.store.pipe(select('user'));
    this.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;
    });
    this.user = this.transferService.dataGet('userData');
    this.chatId = this.route.snapshot.params.chatId;
    this.subscribeNewMessagesInit();
    this.subscribeDeleteMessagesInit();
    this.subscribeEditMessagesInit();
    this.userObj = {
      chatIdCurr: this.chatId,
      userId: this.user.username,
      token: this.sessionStorageService.getValue('_token')
    };
    this.socketIoService.socketEmit(SocketIO.events.user_in_chat, this.userObj);
    this.getChat();
    this.initDraftMessagesSubscription();
    this.subscribeUserIsTyping();
    const thisChat = this.user.chats.find(chat => chat.chatId === this.chatId);
    if (thisChat && thisChat.unreadMes > 0) {
      this.socketIoService.socketEmit(SocketIO.events.user_read_message, {
        userId: this.user.username,
        chatId: this.chatId
      });
      this.store.dispatch(
        new userAction.UserReadAllMessages({ unread: 0, chatId: this.chatId })
      );
    }
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
    setTimeout(() => {
      this.changeChatWindowHeigth();
    });
    let draftMessageItem: types.DraftMessage;
    if (this.draftMessage && this.draftMessage.length > 0) {
      draftMessageItem = this.draftMessage[0].draftMessages.find(item => {
        return item.authorId === this.user.username;
      });
    }
    this.isDraftMessageExist = !!draftMessageItem;

    if (this.isDraftMessageExist) {
      this.control = new FormControl(
        draftMessageItem.text,
        Validators.required
      );
      this.isDraftMessageSent = true;
    } else {
      this.control = new FormControl('', Validators.required);
    }

    this.control.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(message => {
        this.inputMes = message;
        this.changeChatWindowHeigth();
      });

    this.control.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(message => {
        const userIsTypingObj: types.UserIsTyping = {
          userId: this.user.username,
          name: this.user.name,
          users: this.chats.users,
          chatId: this.chatId,
          typing: false
        };
        this.socketIoService.socketEmit(
          SocketIO.events.user_is_typing,
          userIsTypingObj
        );
        this.isUserTyping = false;
        if (message && !this.editMessageMode) {
          this.sendDraftMessage();
          this.isDraftMessageSent = true;
        } else if (!message && this.isDraftMessageSent) {
          this.deleteDraftMessage();
          this.isDraftMessageSent = false;
        }
      });

    this.control.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(message => !this.isUserTyping)
      )
      .subscribe(message => {
        const userIsTypingObj: types.UserIsTyping = {
          userId: this.user.username,
          name: this.user.name,
          users: this.chats.users,
          chatId: this.chatId,
          typing: true
        };
        if (message) {
          this.socketIoService.socketEmit(
            SocketIO.events.user_is_typing,
            userIsTypingObj
          );
          this.isUserTyping = true;
        }
      });
  }

  private getMessages(
    chatId: string,
    n: number,
    queryMessagesAmount: number,
    messagesShift: number
  ): void {
    this.isLoadingMessages = true;
    this.data
      .getPrivatChat(
        chatId,
        String(n),
        String(queryMessagesAmount),
        String(messagesShift)
      )
      .subscribe(response => {
        this.isLoadingMessages = false;
        if (response && response.length < 20) {
          this.moreMessages = false;
        } else {
          this.portionMessagesNumber++;
          this.moreMessages = true;
        }
        response.forEach(item => {
          const messageExists = this.arrayOfMessages.some(
            message => message._id === item._id
          );
          if (!messageExists) {
            this.arrayOfMessages.push(item);
          }
        });
        this.messageBoxElement.scrollTo(0, 1);
      });
  }

  private shiftMessagesQuery(): void {
    this.messagesShift++;
    if (this.messagesShift === types.Defaults.QUERY_MESSAGES_AMOUNT) {
      this.messagesShift = 0;
      this.portionMessagesNumber++;
    }
  }

  private scrollDownMessageWindow(): void {
    const chatWindowsSrollHeight: number = this.messageBoxElement.scrollHeight;
    const chatWindowsClientHeight: number = this.messageBoxElement.clientHeight;
    this.messageBoxElement.scrollTo(
      0,
      chatWindowsSrollHeight - chatWindowsClientHeight
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

  private subscribeDeleteMessagesInit(): void {
    this.socketIoService
      .on(SocketIO.events.delete_message)
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((message: types.DeleteMessage) => {
        const messageIndex: number = this.arrayOfMessages.findIndex(
          item => item._id === message.messageId
        );
        this.arrayOfMessages.splice(messageIndex, 1);
      });
  }

  private subscribeEditMessagesInit(): void {
    this.socketIoService
      .on(SocketIO.events.edit_message)
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((message: types.EditMessage) => {
        this.arrayOfMessages.find(item => {
          if (item._id === message.messageId) {
            item.text = message.text;
            item.edited = true;
          }
          return item._id === message.messageId;
        });
      });
  }

  private subscribeNewMessagesInit(): void {
    this.socketIoService
      .on(SocketIO.events.new_message)
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(message => {
        this.arrayOfMessages.unshift(message);
        this.store.dispatch(new userAction.UpdateChatList(message));
        setTimeout(() => {
          this.scrollDownMessageWindow();
        });
        this.shiftMessagesQuery();
      });
  }

  private subscribeUserIsTyping(): void {
    this.socketIoService
      .on(SocketIO.events.user_is_typing)
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((obj: types.UserIsTyping) => {
        this.userNameIsTyping = obj.name;
        this.showUserIsTyping = obj.typing;
      });
  }
}
