import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PopupControlsService, PopupControls } from 'src/app/services/popup-controls.service';
import { types } from 'src/app/types/types';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { SocketIO } from 'src/app/types/socket.io.types';
import * as userAction from '../../../../store/actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-chat-info-popup',
  templateUrl: './group-chat-info-popup.component.html',
  styleUrls: ['./group-chat-info-popup.component.scss']
})
export class GroupChatInfoPopupComponent implements OnInit, OnDestroy {

  public popup: PopupControls;
  public popupConfig: types.FormPopupConfig;
  public user$: Observable<types.User>;
  public user: types.User;
  public contacts: types.CreateNewChatUser[];
  public popupClosed: boolean;
  public usersOutOfChat: types.CreateNewChatUser[] = [];
  public showUsersOutOfChat = false;

  @Input() public usersInChat: types.CreateNewChatUser[];
  @Input() public admin: string;
  @Input() public chatId: string;
  @Input() public chatName: string;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private popupControlsService: PopupControlsService,
              private store: Store<types.User>,
              private socketIOService: SocketIoService,
              private router: Router) { }

  ngOnInit() {
    this.popup = this.popupControlsService.create(true);
    this.popupConfig = {
      header: 'Chat info',
      isHeaderCloseBtn: true,
      isFooter: true,
      isHeader: true,
      footer: {
        isCloseBtn: true,
        isSubmitBtn: false
      }
    };
    this.user$ = this.store.select('user');
    this.user$.pipe(takeUntil(this.unsubscribe$))
    .subscribe(user => {
      this.user = user;
      this.contacts = user.contacts.map(contact => {
        return {
          avatar: contact.avatar,
          email: contact.email,
          username: contact.id,
          name: contact.name
        };
      });
      this.contacts = this.contacts.filter(contact => !contact.deleted);
    });
    this.socketIOService.on(SocketIO.events.delete_user_from_group_chat_response)
    .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: {chatId: string, userToDelete: string}) => {
      const deletedUser = this.usersInChat.find(user => user.username === response.userToDelete);
      this.usersInChat = this.usersInChat.filter(userInChat => userInChat.username !== response.userToDelete);
      this.usersOutOfChat.push(deletedUser);
    });
    this.socketIOService.on(SocketIO.events.add_user_to_chat_response)
    .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: {chatId: string, userToAdd: types.CreateNewChatUser}) => {
      this.usersOutOfChat = this.usersOutOfChat.filter(user => user.username !== response.userToAdd.username);
      const userInChat: types.CreateNewChatUser = {
        username: response.userToAdd.username,
        name: response.userToAdd.name,
        email: response.userToAdd.email,
        avatar: response.userToAdd.avatar
      };
      this.usersInChat.push(userInChat);
    });
    this.socketIOService.on(SocketIO.events.delete_group_chat_response)
    .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: {chatId: string}) => {
      this.store.dispatch(new userAction.DeleteGroupChat(response));
      this.router.navigate(['/main/chats']);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.popup) {
      this.popup.close();
    }
  }

  public addUserToChat(user: types.CreateNewChatUser): void {
    const addUserObj: types.AddUserToChatSocketIO = {
      admin: this.admin,
      chatId: this.chatId,
      username: this.user.username,
      user,
      chatName: this.chatName,
      avatar: user.avatar
    };
    this.socketIOService.socketEmit(SocketIO.events.add_user_to_chat, addUserObj);
  }

  public addUsersToChat(): void {
    this.showUsersOutOfChat = !this.showUsersOutOfChat;
    const userOutOfChat = this.user.contacts.filter(contact => !this.usersInChat.some(user =>  user.username === contact.id));
    const deletedUsers = this.usersInChat.filter(user => user.deleted === true);
    this.usersOutOfChat = userOutOfChat.map(user => {
      return {
        avatar: user.avatar,
        email: user.email,
        username: user.id,
        name: user.name
      };
    });
    deletedUsers.forEach(u => {
      this.usersOutOfChat.push(u);
    });
  }

  public deleteChat(): void {
    const deleteChat: types.DeleteGroupChat = {
      admin: this.admin,
      chatId: this.chatId,
      users: this.usersInChat
    };
    this.socketIOService.socketEmit(SocketIO.events.delete_group_chat, deleteChat);
  }

  public deleteUserFromChat(username: string): void {
    const userToDelete: types.DeleteUserFromChatSocketIO = {
      userToDelete: username,
      admin: this.admin,
      chatId: this.chatId
    };
    this.socketIOService.socketEmit(SocketIO.events.delete_user_from_group_chat, userToDelete);
  }

  public open(): void {
    if (this.popup) {
      this.popup.open();
      this.popupClosed = false;
    }

  }

  public onClose (): void {
    if (this.popup) {
      this.popup.close();
      this.popupClosed = true;
    }
  }

}
