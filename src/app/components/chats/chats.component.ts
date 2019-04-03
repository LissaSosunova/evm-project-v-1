import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { TransferService } from 'src/app/services/transfer.service';
import { EventEmitter } from 'protractor';
import { DataService } from 'src/app/services/data.service';
import { ChatListComponent } from './chat-list/chat-list.component';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit, OnDestroy {
  public blockedChats: Array<types.Chats> = [];
  public chats: any;
  public deletedChats: Array<types.Chats> = [];
  public groupChats: Array<types.Chats> = [];
  public inputMes: string;
  public privateChats:Array<types.Chats> = [];
  public test: String = 'This is test data';
  public user: types.User = {} as types.User;
  constructor(private transferService: TransferService,
              private route: ActivatedRoute,
              private router: Router,
              private data: DataService) { }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy () {

  }
  public init(): void {
    const user = this.transferService.dataGet('userData');
    this.user = Object.assign({}, user);
    this.transferService.setDataObs(this.test);

  }

  public getChat(id: string): void {
    // const id = window.location.href.toString().split("/chat-window/")[1];
    this.data.getPrivatChat(id).subscribe(
      response => {
        console.log(response);
      }
    )
  }

  

}
