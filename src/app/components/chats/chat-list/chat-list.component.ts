import {
  ActivatedRoute,
  Router
      } from '@angular/router';
import { 
  Component,
  EventEmitter, 
  Input,
  OnInit,
  Output
      } from '@angular/core';
import { types } from 'src/app/types/types';
import { TransferService } from 'src/app/services/transfer.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  @Input() flag: string;
  @Input() size: string;
  @Output() id: EventEmitter<string> = new EventEmitter<string>();
  public blockedChats: Array<types.Chats> = [];
  public chatId: string;
  public deletedChats: Array<types.Chats> = [];
  public groupChats: Array<types.Chats> = [];
  public privateChats:Array<types.Chats> = [];
  public user: types.User = {} as types.User;

  constructor(
    private transferService: TransferService,
              private data: DataService,
              private route: ActivatedRoute,
              private router: Router,
  ) { }

  ngOnInit() {
    this.init();
  }
  public init(): void {
    const user = this.transferService.dataGet('userData');
    this.user = Object.assign({}, user);
    this.getChatList();

  }
  public goToChat(chatId): void {
    this.chatId = chatId;
    // this.router.navigate(['/main/chats/chat-window', this.private_chat]);
    this.router.navigate(['/main/chat-window', this.chatId]);
  }
  public getChatList(): void {
    //Chat types: 1 - private chat, 2 - group chat | event chat, 3 - blocked chat, 4 - deleted chat
    this.user.chats.forEach(item => {
      (item.type === 1) ? this.privateChats.push(item) :
      (item.type === 2) ? this.groupChats.push(item) :
      (item.type === 3) ? this.blockedChats.push(item):
      this.deletedChats.push(item);
    })
  }
}
