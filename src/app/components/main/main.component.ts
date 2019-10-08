import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router, RouterOutlet, NavigationStart } from '@angular/router';
import { TransferService } from 'src/app/services/transfer.service';
import { types } from 'src/app/types/types';
import { DataService } from 'src/app/services/data.service';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { SessionStorageService } from 'src/app/services/session.storage.service';
import { SocketIO } from 'src/app/types/socket.io.types';
import { Store, select } from '@ngrx/store';
import * as userAction from '../../store/actions';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/toasts/services/toast.service';
import { AvatarService } from 'src/app/services/avatar.service';

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
              private sessionStorageService: SessionStorageService,
              private toastService: ToastService,
              private store: Store<types.User>,
              private avatarService: AvatarService) {
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
    const token = this.sessionStorageService.getValue('_token');
    this.socketIoService.socketConnect();
    const dataObj = {
      userId: this.user.username,
      token: token
    };
    this.socketIoService.socketEmit(SocketIO.events.user, dataObj);
    this.socketIoService.on(SocketIO.events.chats_model).pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
      .subscribe(message => {
        this.store.dispatch(new userAction.UpdateChatList(message));
      });
    this.socketIoService.on(SocketIO.events.message_out_of_chat).pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
      .subscribe(message => {
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
        this.toastService.openMessageToast(toastMessageObj, {duration: 5000});
    });

    this.user$ = this.store.pipe(select('user'));
    this.user$.subscribe(user => {
      this.user = user;
      let allUnredMessagesAmount: number = 0;
      this.user.chats.forEach(chatItem => {
        allUnredMessagesAmount = allUnredMessagesAmount + chatItem.unreadMes;
      });
      this.transferService.setDataObs({allUnredMessagesAmount});
    });
    this.subscribeDeleteMessagesInit();
    let contactsAwaiting: number = 0;
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

    this.socketIoService.on(SocketIO.events.confirm_user_request).pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: {userId: string}) => {
      this.store.dispatch(new userAction.ConfirmUser(response));
      const newUser: types.Contact = this.user.contacts.find(contact => contact.id === response.userId);
      this.toastService.openToastSuccess(`User ${newUser.name} has confirmed your request!`);
    });

    this.socketIoService.on(SocketIO.events.reject_request).pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: {userId: string}) => {
      this.store.dispatch(new userAction.DeleteRequest(response));
    });

    this.socketIoService.on(SocketIO.events.delete_contact).pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: {userId: string; chatId: string}) => {
      this.store.dispatch(new userAction.DeleteUser(response));
    });
  }

  ngOnDestroy() {
    this.socketIoService.closeConnection();
    sessionStorage.clear();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public deleteAvatar(): void {
    this.data.deleteAvatar({userId: this.user.username}).subscribe(response => {
      this.store.dispatch(new userAction.UpdateAvatarURL(response));
    });
  }

  public uploadAvatar(event): void {
    const files = this.uploadFile.nativeElement.files;
    const formData: FormData = new FormData();
    formData.append('image', files[0]);
    formData.append('userId', this.user.username);
    this.data.uploadAvatar(formData, this.user.username).subscribe((res) => {
      const avatar: types.Avatar = this.avatarService.parseAvatar(res);
      this.store.dispatch(new userAction.UpdateAvatarURL(avatar));
    }, err => {
      this.toastService.openToastFail('Error in uploading avatar');
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

}
