import {
  ActivatedRoute,
  Router
      } from '@angular/router';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output
      } from '@angular/core';
import { types } from 'src/app/types/types';
import { DataService } from 'src/app/services/data.service';
import {Observable, Subject} from 'rxjs';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { SocketIO } from 'src/app/types/socket.io.types';
import { debounceTime, distinctUntilChanged, takeUntil, take } from 'rxjs/operators';
import {Store} from '@ngrx/store';
import * as userAction from '../../../store/actions';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit, OnDestroy {
  @Input() public flag: string;
  @Input() public size: string;
  @Output() public chatIdEmit: EventEmitter<string> = new EventEmitter<string>();
  public blockedChats: Array<types.Chats> = [];
  public chatId: string;
  public deletedChats: Array<types.Chats>;
  public groupChats: Array<types.Chats>;
  public privateChats: Array<types.Chats>;
  public user: types.User = {} as types.User;
  public user$: Observable<types.User>;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
              private data: DataService,
              private route: ActivatedRoute,
              private router: Router,
              private socketIoService: SocketIoService,
              private store: Store<types.User>
  ) { }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  public goToChat(chatId): void {
    this.chatId = chatId;
    this.chatIdEmit.emit(chatId);
    this.router.navigate([`/main/chat-window/`, chatId], {relativeTo: this.route.parent});
  }
  public getChatList(): void {
    // Chat types: 1 - private chat, 2 - group chat | event chat, 3 - blocked chat, 4 - deleted chat
    this.privateChats = [];
    this.groupChats = [];
    this.blockedChats = [];
    this.deletedChats = [];
    this.user.chats.forEach(item => {
      (item.type === types.ChatType.PRIVATE_CHAT) ? this.privateChats.push(item) :
      (item.type === types.ChatType.GROUP_OR_EVENT_CHAT) ? this.groupChats.push(item) :
      (item.type === types.ChatType.BLOCKED_CHAT) ? this.blockedChats.push(item) :
      this.deletedChats.push(item);
    });
  }

  private init(): void {
    this.chatId = this.route.snapshot.params.chatId;
    this.user$ = this.store.select('user');
    this.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;
      this.getChatList();
    });
  }


}
