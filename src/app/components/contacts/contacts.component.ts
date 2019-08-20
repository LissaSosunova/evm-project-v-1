import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { PopupDetailsComponent } from './popup-details/popup-details.component';
import {Observable, Subject} from 'rxjs';
import { ToastService } from 'src/app/shared/toasts/services/toast.service';
import { types } from 'src/app/types/types';
import { UserInfoPopupComponent } from '../home/user-info-popup/user-info-popup.component';
import {Store} from '@ngrx/store';
import * as userAction from '../../store/actions';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})

export class ContactsComponent implements OnInit, AfterViewInit, OnDestroy {


  private createNewChatParams: types.CreateNewChat;
  public actionName: string;
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
  public querySearch: any[];
  public result: any;
  public searchControl: FormControl;
  public user: types.User = {} as types.User;
  public user$: Observable<types.User>;
  public nothingFound: boolean = false;

  @ViewChild('userPopup') private userPopup: UserInfoPopupComponent;
  @ViewChild('popupDetails') private confirmAction: PopupDetailsComponent;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private data: DataService,
              private toastService: ToastService,
              private store: Store<types.User>) {

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
    this.data.addUser(this.query).subscribe(
      data => {
        for (let i = 0; i < this.querySearch.length; i++) {
          if (this.querySearch[i].id === this.query.query) {
            this.querySearch.splice(i, 1);
          }
        }
        this.user = Object.assign({}, data);
        this.store.dispatch(new userAction.InitUserModel(this.user));
        this.initSortContactLists();
      }
    );
  }

  public confNewUser(query: string): void {
    this.query = {
      query: query
    };
    this.data.confUser(this.query).subscribe(
      data => {
        this.user = Object.assign({}, data);
        this.store.dispatch(new userAction.InitUserModel(this.user));
        this.initSortContactLists();
        this.toastService.openToastSuccess('Confirmed!');
      }
    );
  }

  public goToChat(data): void {
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
    
    if (this.private_chat &&
      this.private_chat !== '0') {
        this.router.navigate(['/main/chat-window', this.private_chat]);
    } else {
      this.data.createNewPrivateChat(this.createNewChatParams).subscribe(
        resp => {
          console.log(resp);
          this.user = Object.assign({}, resp.user);
          this.store.dispatch(new userAction.InitUserModel(this.user));
          this.private_chat = resp.chat.id;
          this.router.navigate(['/main/chat-window', this.private_chat]);
        }
      );
    }
  }
  private init(): void {
    this.user$ = this.store.select('user');
    this.user$.subscribe(user => this.user = user);
    this.currTab = this.route.snapshot.queryParams.currTab;
    this.initSortContactLists();
    if (!this.currTab) {
      this.currTab = 'contacts';
    }
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

  public onConfirmActionPopupOpen(actionName: string): void {
    this.actionName = actionName;
    this.confirmAction.open();
  }

  public onReset(event): void {
    this.nothingFound = false;
  }

  public onUserInfoPopupOpen(): void {
    this.userPopup.open();
  }

  public setSearch(query: string): void {
    this.query = {
      query: query
    };
    this.data.findUser(this.query).subscribe(
      data => {
        this.querySearch = data;
        if (this.querySearch && this.querySearch.length === 0) {
          this.nothingFound = true;
        } else {
          this.nothingFound = false;
        }
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
}
