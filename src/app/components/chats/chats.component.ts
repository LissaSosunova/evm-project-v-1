import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { DataService } from 'src/app/services/data.service';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

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
  public user: types.User = {} as types.User;
  public user$: Observable<types.User>;

  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private data: DataService,
              private store: Store<types.User>
              ) { }


  ngOnInit() {
    this.init();
  }

  ngOnDestroy () {
 
  }

  public init(): void {
    this.user$ = this.store.select('user');
  }

  public getChat(id: string): void {
    // const id = window.location.href.toString().split("/chat-window/")[1];
    this.data.getPrivatChat(id, '0').subscribe(
      response => {
        console.log(response);
      }
    )   
  }

}
