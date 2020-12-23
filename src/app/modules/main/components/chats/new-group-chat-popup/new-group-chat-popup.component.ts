import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PopupControlsService, PopupControls } from 'src/app/services/popup-controls.service';
import { types } from 'src/app/types/types';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { SocketIO } from 'src/app/types/socket.io.types';

@Component({
  selector: 'app-new-group-chat-popup',
  templateUrl: './new-group-chat-popup.component.html',
  styleUrls: ['./new-group-chat-popup.component.scss']
})
export class NewGroupChatPopupComponent implements OnInit, OnDestroy {

  public popup: PopupControls;
  public popupConfig: types.FormPopupConfig;
  public newChatModel: types.NewGroupChat = {} as types.NewGroupChat;
  public user$: Observable<types.User>;
  public contacts: types.CreateNewChatUser[];
  public submitDisabled = true;
  @ViewChild('newGroupChatForm', {static: false}) private newGroupChatForm: NgForm;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private popupControlsService: PopupControlsService,
              private store: Store<types.User>,
              private changeDetector: ChangeDetectorRef,
              private socketIOService: SocketIoService) { }

  ngOnInit() {
    this.popup = this.popupControlsService.create(true);
    this.popupConfig = {
      header: 'New group chat',
      isHeaderCloseBtn: true,
      isFooter: true,
      isHeader: true,
      footer: {
        isCloseBtn: true,
        isSubmitBtn: true
      }
    };
    this.user$ = this.store.select('user');
    this.user$.pipe(takeUntil(this.unsubscribe$))
    .subscribe(user => {
      this.newChatModel.admin = user.username;
      const admin: types.CreateNewChatUser = {
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      };
      this.newChatModel.users = [];
      this.newChatModel.users.push(admin);
      this.contacts = user.contacts.map(contact => {
        return {
          avatar: contact.avatar,
          email: contact.email,
          username: contact.id,
          name: contact.name,
          selected: false
        };
      });
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.popup) {
      this.popup.close();
    }
  }

  public open(): void {
    if (this.popup) {
      this.popup.open();
      this.changeDetector.detectChanges();
      this.newGroupChatForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe(res => {
        if (!res.chatName) {
          this.submitDisabled = true;
        } else if (res.chatName) {
          this.submitDisabled = false;
        }
      });
    }

  }

  public onClose (): void {
    if (this.popup) {
      this.popup.close();
    }
  }

  public onSubmit(): void {
    this.newChatModel.users.forEach(user => {
      delete user.selected;
    });
    this.socketIOService.socketEmit(SocketIO.events.new_group_chat, this.newChatModel);
    this.popup.close();
  }

  public select(contact: types.CreateNewChatUser, event): void {
    if (contact.selected) {
      this.newChatModel.users.push(contact);
    } else {
      this.newChatModel.users = this.newChatModel.users.filter(user => user.username !== contact.username);
    }
  }

}
