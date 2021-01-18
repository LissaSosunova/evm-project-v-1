import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { TransferService } from 'src/app/services/transfer.service';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { DateTransformService } from 'src/app/modules/main/services/date-transform.service';
import { Observable, Subject } from 'rxjs';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { SocketIO } from 'src/app/types/socket.io.types';
import { select, Store } from '@ngrx/store';
import * as userAction from '../../../../../store/actions';
import { PageMaskService } from 'src/app/services/page-mask.service';
import { ChatEmotions } from 'src/app/constants/chat-emotions';
import { GroupChatInfoPopupComponent } from './group-chat-info-popup/group-chat-info-popup.component';
import { NewGroupChatPopupComponent } from '../new-group-chat-popup/new-group-chat-popup.component';
import { ToastService } from 'src/app/modules/shared/toasts/services/toast.service';
import { CookieService } from 'src/app/core/services/cookie.service';
import { MainApiService } from '../../../services/main.api.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit, AfterViewInit, OnDestroy {
  public arrayOfMessages: Array<types.Message> = [];
  public arrayOfUsers: any[];
  public blockedChats: Array<types.Chats> = [];
  public control: FormControl;
  public deletedChats: Array<types.Chats> = [];
  public draftMessage: types.DraftMessage[];
  public groupChats: Array<types.Chats> = [];
  public editMessageMode = false;
  public inputMes: string;
  public isDraftMessageExist: boolean;
  public isDraftMessageSent = false;
  public isLoadingMessages: boolean;
  public isMessages = false;
  public isSendBtn = true;
  public moreMessages = false;
  public portionMessagesNumber: number;
  public privateChats: Array<types.Chats> = [];
  public showArrowDown = false;
  public showUserIsTyping: boolean;
  public test: string;
  public user: types.User = {} as types.User;
  public userNameIsTyping: string;
  public emotions = ChatEmotions;
  public messageControl: FormControl;
  public openEmoList = false;
  @ViewChild('messageBox', { static: true }) private messageBox: ElementRef;
  private messageBoxElement: HTMLDivElement;
  @ViewChild('footer', { static: true }) private footer: ElementRef;
  private footerElement: HTMLDivElement;
  @ViewChild('arrowDown', { static: true }) public arrowDown: ElementRef;
  private arrowDownElement: HTMLDivElement;
  @ViewChild('menuBlock', { static: true }) private menuBlock: ElementRef;
  private menuBlockElement: HTMLDivElement;
  @ViewChild('groupChatInfoPopup', {static: true}) private groupChatInfoPopup: GroupChatInfoPopupComponent;
  @ViewChild('newGroupChatPopup', {static: true}) private newGroupChatPopup: NewGroupChatPopupComponent;
  public chats: types.ChatData;
  public chatId: string;
  private messagesShift = 0;
  private userObj: { chatIdCurr: string; userId: string; token: string };
  private isUserTyping = false;
  private unsubscribe$: Subject<void> = new Subject<void>();
  private user$: Observable<types.User>;
  private editedMessage: types.Message;
  private sidebarExpand: boolean;
  private pattern: RegExp = /[^\s]/;

  constructor(private transferService: TransferService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private dateTransformService: DateTransformService,
    private socketIoService: SocketIoService,
    private pageMaskService: PageMaskService,
    private store: Store<types.User>,
    private cookieService: CookieService,
    private mainApiService: MainApiService,
  ) {}

  ngOnInit() {
    let notFirstInit = false;
    this.route.params.subscribe(param => {
      if (notFirstInit) {
        this.destroy();
      }
      this.init();
      notFirstInit = true;
      setTimeout(() => {
        this.afterViewInit();
      });
    });
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
      this.getMessages(this.chatId, this.portionMessagesNumber, types.Defaults.QUERY_MESSAGES_AMOUNT, this.messagesShift);
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
    if (!this.sidebarExpand && this.groupChatInfoPopup.popupClosed) {
      this.pageMaskService.close();
    }
  }

  public completeEditing(): void {
    if (this.user.username !== this.editedMessage.authorId) {
      return;
    }
    this.inputMes = this.inputMes.replace(/\n/g, '<br/>');
    this.inputMes = this.inputMes.replace('<br/><br/>', '');
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
    this.socketIoService.socketEmit(SocketIO.events.delete_message, deleteMessageObj);
  }

  public get getChatName(): string {
    if (this.chats.type === types.ChatType.PRIVATE_CHAT) {
      const chat = this.user.chats.find(c => c.chatId === this.chatId);
      return `Chat with ${chat.name}`;
    } else if (this.chats.type === types.ChatType.GROUP_OR_EVENT_CHAT) {
      return this.chats.chatName;
    }
  }

  public editMessage(message: types.Message): void {
    this.editMessageMode = true;
    const text: string = message.text.replace(/<br\/>/g, '\n');
    this.control.setValue(text);
    this.editedMessage = message;
    const documentWidth: number = document.documentElement.clientWidth;
    if (documentWidth < 380) {
      this.isSendBtn = false;
    }
    setTimeout(() => {
      this.changeChatWindowHeigth();
    });
  }

  public onChatIdEmit(chatId: string): void {
    this.clickOutsideMenuBlock();
  }

  public openChatPopup(): void {
    this.groupChatInfoPopup.open();
  }

  public outsideEmoClick(): void {
    this.openEmoList = false;
  }

  public writeMessage(e): void {
    this.inputMes = e.target.value;
    if (this.control.valid && !this.editMessageMode) {
      setTimeout(() => {
        this.sendMessage();
      });
    } else if (this.control.valid && this.editMessageMode) {
      this.completeEditing();
    }
  }

  public openEmo(): void {
    this.openEmoList = !this.openEmoList;
  }

  public newGroupChat(): void {
    this.newGroupChatPopup.open();
  }

  public chooseEmo(emo: string): void {
    if (this.inputMes) {
      this.inputMes = this.inputMes + emo;
    } else {
      this.inputMes = emo;
    }
  }

  public sendMessage(): void {
    this.inputMes = this.inputMes.replace(/\n/g, '<br/>');
    this.inputMes = this.inputMes.replace('<br/><br/>', '');
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
    const userIsTypingObj: types.UserIsTyping = {
      userId: this.user.username,
      name: this.user.name,
      users: this.chats.users,
      chatId: this.chatId,
      typing: false
    };
    this.socketIoService.socketEmit(SocketIO.events.user_is_typing, userIsTypingObj);
    this.isUserTyping = false;
    setTimeout(() => {
      this.changeChatWindowHeigth();
      this.scrollDownMessageWindow();
      this.inputMes = this.inputMes.replace(/\n/g, '');
    });
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
    this.messageBoxElement.style.maxHeight = `calc(100vh - ${footerHeigth}px - 140px)`;
  }

  private getChat(): void {
    this.chats = this.route.snapshot.data.chatMessages;
    if (!this.chats) {
      this.toastService.openToastFail('Unable to get messages');
      this.router.navigate(['/main/chats']);
      this.store.dispatch(new userAction.DeleteGroupChat({chatId: this.chatId}));
    }
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
    this.socketIoService.socketEmit(SocketIO.events.user_left_chat, this.userObj);
    this.socketIoService.deleteChatId(this.chatId);
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
      this.socketIoService.socketEmit(SocketIO.events.user_is_typing, userIsTypingObj);
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.inputMes = '';
    this.newGroupChatPopup.onClose();
  }

  private init(): void {
    this.chatId = this.route.snapshot.params.chatId;
    this.getChat();
    this.showUserIsTyping = false;
    this.unsubscribe$ = new Subject<void>();
    this.user$ = this.store.pipe(select('user'));
    this.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;
      this.chats.users.forEach(u => {
        if (u.username === this.user.username) {
          u.avatar = this.user.avatar;
        }
        const userInChat = user.contacts.find(c => c.id === u.username);
        if (userInChat) {
          u.avatar = userInChat.avatar;
        }
      });
    });
    this.subscribeNewMessagesInit();
    this.subscribeDeleteMessagesInit();
    this.subscribeEditMessagesInit();
    this.subscribeUserLeftChat();
    this.userObj = {
      chatIdCurr: this.chatId,
      userId: this.user.username,
      token: this.cookieService.getCookie('access_token'),
    };
    this.socketIoService.socketEmit(SocketIO.events.user_in_chat, this.userObj);
    this.socketIoService.setChatId = this.chatId;
    this.initDraftMessagesSubscription();
    this.subscribeUserIsTyping();
    this.subscribeUserReadMessage();
    const thisChat: types.Chats = this.user.chats.find(chat => chat.chatId === this.chatId);
    if (thisChat && thisChat.unreadMes > 0) {
      this.socketIoService.socketEmit(SocketIO.events.user_read_message, {
        userId: this.user.username,
        chatId: this.chatId
      });
      this.store.dispatch(new userAction.UserReadAllMessages({ unread: 0, chatId: this.chatId }));
    }
    this.transferService.dataObj$.pipe(takeUntil(this.unsubscribe$))
    .subscribe(res => {
      if (res.toggleSidebarState !== undefined) {
        this.sidebarExpand = res.toggleSidebarState;
      }
    });
  }

  private deleteDraftMessage(): void {
    this.mainApiService.deleteRequest(`/chat/delete_draft_message/${this.chatId}`)
    .subscribe(res => {
      this.isDraftMessageExist = false;
    });
  }

  private initDraftMessagesSubscription(): void {
    this.draftMessage = this.chats.draftMessages;
    if (!this.draftMessage) {
      this.toastService.openToastFail('Unable to get data from server');
    }
    setTimeout(() => {
      this.changeChatWindowHeigth();
    });
    let draftMessageItem: types.DraftMessage;
    if (this.draftMessage) {
      draftMessageItem = this.draftMessage.find(item => {
        return item.authorId === this.user.username;
      });
    }
    this.isDraftMessageExist = !!draftMessageItem;
    if (this.isDraftMessageExist) {
      this.control = new FormControl(
        draftMessageItem.text,
        [Validators.required, Validators.pattern(this.pattern)]
      );
      this.isDraftMessageSent = true;
      this.inputMes = draftMessageItem.text;
    } else {
      this.control = new FormControl('', [Validators.required, Validators.pattern(this.pattern)]);
      this.inputMes = '';
    }

    this.control.valueChanges.pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe(message => {
        this.scrollDownMessageWindow();
        this.inputMes = message;
        this.changeChatWindowHeigth();
      });

    this.control.valueChanges.pipe(debounceTime(2000), distinctUntilChanged(), takeUntil(this.unsubscribe$))
      .subscribe(message => {
        message = message.replace(/\n\n\n/, '');
        const userIsTypingObj: types.UserIsTyping = {
          userId: this.user.username,
          name: this.user.name,
          users: this.chats.users,
          chatId: this.chatId,
          typing: false
        };
        this.socketIoService.socketEmit(SocketIO.events.user_is_typing, userIsTypingObj);
        this.isUserTyping = false;
        if (message && !this.editMessageMode) {
          this.sendDraftMessage();
          this.isDraftMessageSent = true;
        } else if (!message && this.isDraftMessageSent) {
          this.deleteDraftMessage();
          this.isDraftMessageSent = false;
        }
      });

    this.control.valueChanges.pipe(takeUntil(this.unsubscribe$), filter(message => !this.isUserTyping))
      .subscribe(message => {
        const userIsTypingObj: types.UserIsTyping = {
          userId: this.user.username,
          name: this.user.name,
          users: this.chats.users,
          chatId: this.chatId,
          typing: true
        };
        if (message) {
          this.socketIoService.socketEmit(SocketIO.events.user_is_typing, userIsTypingObj);
          this.isUserTyping = true;
        }
      });
  }

  private getMessages(chatId: string, n: number, queryMessagesAmount: number, messagesShift: number): void {
    this.isLoadingMessages = true;
    const data = {
      queryNum: String(n),
      queryMessagesAmount: String(queryMessagesAmount),
      messagesShift: String(messagesShift)
    };
    this.mainApiService.getRequest(`/chat/private_chat/${chatId}`, data)
      .subscribe((response: types.Message[]) => {
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

  public scrollDownMessageWindow(): void {
    const chatWindowsSrollHeight: number = this.messageBoxElement.scrollHeight;
    const chatWindowsClientHeight: number = this.messageBoxElement.clientHeight;
    this.messageBoxElement.scrollTo(0, chatWindowsSrollHeight - chatWindowsClientHeight);
  }

  private sendDraftMessage(): void {
    const date = this.dateTransformService.nowUTC();
    const draftMessage: types.DraftMessage = {
      chatID: this.chatId,
      text: this.inputMes,
      date: date,
    };
    this.mainApiService.postRequest('/chat/set_draft_message', draftMessage)
    .subscribe(res => {
      this.isDraftMessageSent = true;
    });
  }

  private subscribeDeleteMessagesInit(): void {
    this.socketIoService.on(SocketIO.events.delete_message)
      .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
      .subscribe((message: types.DeleteMessage) => {
        const messageIndex: number = this.arrayOfMessages.findIndex(item => item._id === message.messageId);
        this.arrayOfMessages.splice(messageIndex, 1);
      });
  }

  private subscribeEditMessagesInit(): void {
    this.socketIoService.on(SocketIO.events.edit_message)
      .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
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
    this.socketIoService.on(SocketIO.events.new_message)
      .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
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
    this.socketIoService.on(SocketIO.events.user_is_typing)
      .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
      .subscribe((obj: types.UserIsTyping) => {
        this.userNameIsTyping = obj.name;
        this.showUserIsTyping = obj.typing;
      });
  }

  private subscribeUserReadMessage(): void {
    this.socketIoService.on(SocketIO.events.user_read_message)
    .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((obj: {chatId: string, userId: string}) => {
      if (this.chatId !== obj.chatId) {
        return;
      }
      this.arrayOfMessages.forEach(message => {
        message.unread = message.unread.filter(u => u !== obj.userId);
      });
    });
  }

  private subscribeUserLeftChat(): void {
    this.socketIoService.on(SocketIO.events.user_left_group_chat)
    .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((data: {userId: string, chatId: string}) => {
      const user = this.chats.users.find(u => u.username === data.userId);
      this.toastService.openToastSuccess(`User ${user.name} left chat`);
      this.chats.users = this.chats.users.filter(u => u.username !== data.userId);
    });
  }
}
