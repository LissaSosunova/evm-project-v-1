import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferService } from 'src/app/services/transfer.service';
import { types } from 'src/app/types/types';
import { DataService } from 'src/app/services/data.service';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { SocketIO } from 'src/app/types/socket.io.types';
import { Store, select } from '@ngrx/store';
import * as userAction from '../../../../store/actions';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/modules/shared/toasts/services/toast.service';
import { AvatarService } from '../../services/avatar.service';
import { MainApiService } from '../../services/main.api.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit, OnDestroy {

  public user: types.User = {} as types.User;
  public avatar: string;
  public user$: Observable<types.User>;
  @ViewChild('uploadFile', {static: true}) public uploadFile: ElementRef;
  private unsubscribe$: Subject<void> = new Subject();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private data: DataService,
              private transferService: TransferService,
              private socketIoService: SocketIoService,
              private toastService: ToastService,
              private store: Store<types.User>,
              private avatarService: AvatarService,
              private mainApiService: MainApiService) {
    }

  ngOnInit() {
    this.user = this.route.snapshot.data.userData;
    this.user.avatar = this.avatarService.parseAvatar(this.user.avatar);
    this.user.contacts.forEach(contact => {
      contact.avatar = this.avatarService.parseAvatar(contact.avatar);
    });
    this.user.chats.forEach(chatItem => {
      chatItem.avatar = this.avatarService.parseAvatar(chatItem.avatar);
    });
    this.store.dispatch(new userAction.InitUserModel(this.user));
    this.transferService.dataSet({name: 'userData', data: this.user});
    this.socketIoService.socketConnect(this.user.username);
    this.chatsModelSubscribe();
    this.messageOutOfChatSubscribe();
    this.addUserRequestSubscribe();
    this.subscribeDeleteMessagesInit();
    this.confirmUserRequestSubscribe();
    this.rejectRequestSubscribe();
    this.deleteContactSubscribe();
    this.subscribeNewEvents();
    this.subscribeSocketErrors();
    this.subscribeNewGroupChat();
    this.subscribeDeleteUserFromChat();
    this.subscribeAddUserToGroupChat();
    this.subscribeDeleteGroupChat();
    this.user$ = this.store.pipe(select('user'));
    this.user$.subscribe(user => {
      this.user = user;
      let allUnredMessagesAmount = 0;
      this.user.chats.forEach(chatItem => {
        allUnredMessagesAmount = allUnredMessagesAmount + chatItem.unreadMes;
      });
      this.transferService.setDataObs({allUnredMessagesAmount});
    });
  }

  ngOnDestroy() {
    this.socketIoService.closeConnection();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public editProfile(): void {
    this.router.navigate(['main/profile']);
  }

  private addUserRequestSubscribe(): void {
    let contactsAwaiting = 0;
    this.user.contacts.forEach(contact => {
      if (contact.status === 2) {
        contactsAwaiting++;
      }
    });
    this.transferService.setDataObs({name: 'awaitingContacts', data: contactsAwaiting});

    this.socketIoService.on(SocketIO.events.add_user_request).pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: types.Contact) => {
      this.toastService.openToastSuccess('You have recieved a new request in adding contact!');
      contactsAwaiting++;
      this.transferService.setDataObs({name: 'awaitingContacts', data: contactsAwaiting});
      response.avatar = this.avatarService.parseAvatar(response.avatar);
      this.store.dispatch(new userAction.AddUser(response));
    });
  }

  private chatsModelSubscribe(): void {
    this.socketIoService.on(SocketIO.events.chats_model).pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe(message => {
      this.store.dispatch(new userAction.UpdateChatList(message));
    });
  }

  private confirmUserRequestSubscribe(): void {
    this.socketIoService.on(SocketIO.events.confirm_user_request).pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: {userId: string}) => {
      this.store.dispatch(new userAction.ConfirmUser(response));
      const newUser: types.Contact = this.user.contacts.find(contact => contact.id === response.userId);
      this.toastService.openToastSuccess(`User ${newUser.name} has confirmed your request!`);
    });
  }

  private deleteContactSubscribe(): void {
    this.socketIoService.on(SocketIO.events.delete_contact).pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: {userId: string; chatId: string}) => {
      this.store.dispatch(new userAction.DeleteUser(response));
    });
  }

  private messageOutOfChatSubscribe(): void {
    this.socketIoService.on(SocketIO.events.message_out_of_chat).pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
      .subscribe((message: types.Message) => {
        const messageText: string = message.text.replace(/<br\/>/g, '\n');
        const contactOfIncomingMessage: types.Contact = this.user.contacts.find(contact => contact.id === message.authorId);
        if (!contactOfIncomingMessage) {
          // тот случай, когда нет в контактах автора входящего сообщения
          // шлём запрос на сервер, чтобы получить его имя и аватарку
        }
        const toastMessageObj: types.ContactForToastMessage = {
          text: `New message from ${contactOfIncomingMessage.name}`,
          avatar: contactOfIncomingMessage.avatar.url,
          message: messageText,
          userId: message.authorId,
          chatId: message.chatID
        };
        const ifChatExist = this.user.chats.find(c => c.chatId === message.chatID);
        if (!ifChatExist) {
          const chat: types.Chats = {
            avatar: contactOfIncomingMessage.avatar,
            chatId: message.chatID,
            id: message.authorId,
            name: contactOfIncomingMessage.name,
            users: message.users,
            type: contactOfIncomingMessage.status,
            unreadMes: 1
          };
          this.store.dispatch(new userAction.AddChat(chat));
        }
        this.toastService.openMessageToast(toastMessageObj, {duration: 5000});
    });
  }

  private rejectRequestSubscribe(): void {
    this.socketIoService.on(SocketIO.events.reject_request).pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: {userId: string}) => {
      this.store.dispatch(new userAction.DeleteRequest(response));
    });
  }

  private subscribeDeleteGroupChat(): void {
    this.socketIoService.on(SocketIO.events.delete_group_chat)
    .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: {chatId: string}) => {
      this.store.dispatch(new userAction.DeleteGroupChat(response));
    });
  }

   private subscribeDeleteMessagesInit(): void {
    this.socketIoService.on(SocketIO.events.delete_message_out_of_chat)
      .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
      .subscribe((message: types.DeleteMessage) => {
        const unreadUser: string = message.unread.find(userId => userId === this.user.username);
        if (unreadUser) {
          this.store.dispatch(new userAction.DeleteMessageUpdate(message));
        }
      });
  }

  private subscribeDeleteUserFromChat(): void {
    this.socketIoService.on(SocketIO.events.delete_user_from_group_chat)
    .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: {chatId: string, userToDelete: string}) => {
      this.store.dispatch(new userAction.DeleteUserFromChat(response));
      this.toastService.openToastWarning('Your were removed from chat');
    });
  }

  private subscribeNewGroupChat(): void {
    this.socketIoService.on(SocketIO.events.new_group_chat)
    .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: types.Chats) => {
      this.store.dispatch(new userAction.AddChat(response));
      this.toastService.openToastSuccess('You were added to a new group chat');
    });
    this.socketIoService.on(SocketIO.events.new_group_chat_response)
    .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: types.Chats) => {
      this.store.dispatch(new userAction.AddChat(response));
      this.router.navigate([`/main/chat-window/${response.chatId}`]);
    });
  }

  private subscribeAddUserToGroupChat(): void {
    this.socketIoService.on(SocketIO.events.add_user_to_chat)
    .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: types.Chats) => {
      this.store.dispatch(new userAction.AddChat(response));
      this.toastService.openToastSuccess('You were added to a new group chat');
    });
  }

  private subscribeNewEvents(): void {
    this.socketIoService.on(SocketIO.events.new_event)
    .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((event: types.EventDb) => {
      this.store.dispatch(new userAction.NewEvent(event));
      this.toastService.openToastSuccess(`You are invited to new event!`);
    });
  }

  private subscribeSocketErrors(): void {
    this.socketIoService.on(SocketIO.events.error)
    .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((error: types.SocketError) => {
      console.error(error);
    });
  }

}
