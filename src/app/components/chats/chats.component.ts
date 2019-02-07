import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { TransferService } from 'src/app/services/transfer.service';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit, OnDestroy {
  public user: types.User = {} as types.User;
  public test: String = 'This is test data';
  public chats: types.Chats;
  public inputMes: string;
  constructor(private transferService: TransferService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy () {

  }
  public init(): void {
    const user = this.transferService.dataGet('userData');
    this.user = Object.assign(user);
    this.transferService.setDataObs(this.test);
  }

}
