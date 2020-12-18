import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { debounceTime, distinctUntilChanged, takeUntil, take } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { PopupDetailsComponent } from './popup-details/popup-details.component';
import {Observable, Subject} from 'rxjs';
import { types } from 'src/app/types/types';
import { UserInfoPopupComponent } from '../home/user-info-popup/user-info-popup.component';
import {Store} from '@ngrx/store';
import * as userAction from '../../../../store/actions';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { SocketIO } from 'src/app/types/socket.io.types';
import { TransferService } from 'src/app/services/transfer.service';
import { ToastService } from 'src/app/modules/shared/toasts/services/toast.service';
import { MainApiService } from '../../services/main.api.service';
import { AvatarService } from '../../services/avatar.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, AfterViewInit, OnDestroy {

  private createNewChatParams: types.CreateNewChat;
  public actionName: types.ContactAction;
  public chatId: string;
  public contactsAwaiting: Array<types.Contact> = [];
  public contactsConfirmed: Array<types.Contact> = [];
  public contactsRequested: Array<types.Contact> = [];
  public currTab: string;
  public isContactsAwaiting: boolean;
  public isContactsConfirmed: boolean;
  public iscontactsRequested: boolean;
  public isOpened: boolean;
  public private_chat: string;
  public query: types.FindUser;
  public querySearch: types.SearchContact[];
  public result: any;
  public searchControl: FormControl;
  public user: types.User = {} as types.User;
  public user$: Observable<types.User>;
  public nothingFound = false;
  public selectedContact: types.Contact;
  public showSpinner = false;
  public contactAction = types.ContactAction;

  @ViewChild('userPopup', {static: true}) private userPopup: UserInfoPopupComponent;
  @ViewChild('popupDetails', {static: true}) private confirmAction: PopupDetailsComponent;

  private unsubscribe$: Subject<void> = new Subject();
  private selectedUser: string;

  constructor(private avatarService: AvatarService,
              private route: ActivatedRoute,
              private router: Router,
              private data: DataService,
              private toastService: ToastService,
              private transferService: TransferService,
              private socketIOService: SocketIoService,
              private store: Store<types.User>,
              private mainApiService: MainApiService,) {

            }

  ngOnInit() {
    this.init();
    this.initSearchForm();
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.userPopup.onClose();
    this.confirmAction.onClose();
  }


  public addNewUser(query: string): void {
    this.query = {
      query: query
    };
    this.socketIOService.socketEmit(SocketIO.events.add_user, {queryUserId: query, userId: this.user.username});
  }

  public confNewUser(query: string): void {
    this.query = {
      query: query
    };
    this.socketIOService.socketEmit(SocketIO.events.confirm_user, {queryUserId: query, userId: this.user.username});
  }

  public confirmActionClick(deleteChat: boolean): void {
    if (this.actionName === types.ContactAction.DELETE_REQUEST || this.actionName === types.ContactAction.REJECT_REQUEST) {
      this.socketIOService.socketEmit(SocketIO.events.delete_request, {queryUserId: this.selectedUser, userId: this.user.username});
      this.confirmAction.onClose();
    } else if (this.actionName === types.ContactAction.DELETE_CONTACT) {
      const chatItem = this.user.chats.find(chat => chat.id === this.selectedUser);
      let chatIdToDelete: string;
      if (chatItem) {
        chatIdToDelete = chatItem.chatId;
      } else {
        chatIdToDelete = undefined;
      }
      const obj =  {
        deleteContactId: this.selectedUser,
        userId: this.user.username,
        chatIdToDelete,
        deleteChat
      };
      this.socketIOService.socketEmit(SocketIO.events.delete_contact, obj);
      this.confirmAction.onClose();
    }
  }

  public goToChat(data: {chatId: string; userId: string; email: string; name: string}): void {
    this.private_chat = data.chatId;
    this.createNewChatParams = {
      users: [
        {
          username: this.user.username,
          name: this.user.name,
          email: this.user.email
        },
        {
          username: data.userId,
          name: data.name,
          email: data.email
        }
      ]
    };

    if (this.private_chat && this.private_chat !== '0') {
        this.router.navigate(['/main/chat-window', this.private_chat]);
    } else {
      this.mainApiService.postRequest('/chat/new_private_chat/', this.createNewChatParams)
      .subscribe((resp: types.Chats) => {
          resp.avatar = this.avatarService.parseAvatar(resp.avatar);
          const ifChatExist = this.user.chats.some(chat => chat.chatId === resp.chatId);
          if (!ifChatExist) {
            this.store.dispatch(new userAction.AddChat(resp));
          }
          this.private_chat = resp.chatId;
          this.router.navigate(['/main/chat-window', this.private_chat]);
        }
      );
    }
  }

  public onConfirmActionPopupOpen(actionName: types.ContactAction, userId: string): void {
    this.actionName = actionName;
    this.selectedUser = userId;
    this.confirmAction.open();
  }

  public onReset(event): void {
    this.nothingFound = false;
  }

  public onUserInfoPopupOpen(contact: types.Contact): void {
    this.selectedContact = contact;
    this.userPopup.open();
  }

  public setSearch(query: string): void {
    this.showSpinner = true;
    this.query = {
      query: query
    };
    this.data.findUser(query)
    .subscribe(
      (data: types.SearchContact[]) => {
        this.showSpinner = false;
        this.querySearch = data.filter(contact => contact.id !== this.user.username);
        if (this.querySearch && this.querySearch.length === 0) {
          this.nothingFound = true;
        } else {
          this.nothingFound = false;
          this.querySearch.forEach(contact => {
            contact.avatar = this.avatarService.parseAvatar(contact.avatar);
          });
        }
      }, error => {
        this.showSpinner = false;
      }
    );
  }

  public switcher(currId: string): void {
    this.router.navigate([], {
      queryParams: {
        currTab: currId
      }
    });
    this.currTab = currId;
  }

  private init(): void {
    this.user$ = this.store.select('user');
    this.user$.subscribe(user => {
      this.user = user;
      this.initSortContactLists();
    });
    this.currTab = this.route.snapshot.queryParams.currTab;
    this.initSortContactLists();
    if (!this.currTab) {
      this.currTab = 'contacts';
    }
    this.socketIOService.on(SocketIO.events.add_user).pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: types.Contact) => {
      if (this.querySearch) {
        this.querySearch.find((contact, index) => {
          if (contact.id === this.query.query) {
            this.querySearch.splice(index, 1);
          }
          return contact.id === this.query.query;
        });
      }
      response.avatar = this.avatarService.parseAvatar(response.avatar);
      this.store.dispatch(new userAction.AddUser(response));
      this.initSortContactLists();
    });

    this.socketIOService.on(SocketIO.events.confirm_user).pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: {userId: string}) => {
      this.store.dispatch(new userAction.ConfirmUser(response));
      this.initSortContactLists();
      this.toastService.openToastSuccess('Confirmed!');
    });

    this.socketIOService.on(SocketIO.events.delete_request).pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe((response: {userId: string}) => {
      this.store.dispatch(new userAction.DeleteRequest(response));
      this.initSortContactLists();
    });
  }

  private initSortContactLists(): void {
    this.contactsConfirmed = [];
    this.contactsAwaiting = [];
    this.contactsRequested = [];
    this.isContactsConfirmed = false;
    this.isContactsAwaiting = false;
    this.iscontactsRequested = false;
    for (const o of this.user.contacts) {
      if (o.status === 1) {
        this.isContactsConfirmed = true;
        this.contactsConfirmed.push(o);
      } else if (o.status === 2) {
        this.isContactsAwaiting = true;
        this.contactsAwaiting.push(o);
      } else if (o.status === 3) {
        this.iscontactsRequested = true;
        this.contactsRequested.push(o);
      }
    }
    this.transferService.setDataObs({name: 'awaitingContacts', data: this.contactsAwaiting.length});
  }

  private initSearchForm(): void {
    this.searchControl = new FormControl();
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.unsubscribe$))
      .subscribe(query => {
        if (query) {
          this.setSearch(query);
        } else {
          this.nothingFound = false;
        }
      });
  }

}
