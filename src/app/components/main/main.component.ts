import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterOutlet, NavigationStart } from '@angular/router';
import { TransferService } from 'src/app/services/transfer.service';
import { types } from 'src/app/types/types';
import { DataService } from 'src/app/services/data.service';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit, OnDestroy {

  public user: types.User = {} as types.User;
  private subscription: Subscription;

  constructor(private route: ActivatedRoute,
    public router: Router,
    private data: DataService,
    private transferService: TransferService,
    private socketIoService: SocketIoService,
    private tokenService: TokenService) {
    }

  ngOnInit() {
    this.user = this.route.snapshot.data.userData; // используем резолвер для получения данных пользователя
    console.log(this.user);
    this.subscription = this.transferService.dataObj$.subscribe(res => {
      console.log('test', res);
    });
    this.transferService.dataSet({name: 'userData', data: this.user});
    const token = this.tokenService.getToken();
    this.socketIoService.socketConnect();
    const dataObj = {
      userId: this.user.username,
      token: token
    };
    this.socketIoService.socketEmit(this.socketIoService.events.user, dataObj);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
