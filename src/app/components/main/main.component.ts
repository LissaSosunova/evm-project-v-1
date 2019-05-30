import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router, RouterOutlet, NavigationStart } from '@angular/router';
import { TransferService } from 'src/app/services/transfer.service';
import { types } from 'src/app/types/types';
import { DataService } from 'src/app/services/data.service';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { SessionStorageService } from 'src/app/services/session.storage.service';
import { SocketIO} from 'src/app/types/socket.io.types';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit, OnDestroy {

  public user: types.User = {} as types.User;

  constructor(private route: ActivatedRoute,
    public router: Router,
    private data: DataService,
    private transferService: TransferService,
    private socketIoService: SocketIoService,
    private sessionStorageService: SessionStorageService) {
    }

  ngOnInit() {
    this.user = this.route.snapshot.data.userData; // используем резолвер для получения данных пользователя
    this.transferService.dataSet({name: 'userData', data: this.user});
    const token = this.sessionStorageService.getValue('_token');
    this.socketIoService.socketConnect();
    const dataObj = {
      userId: this.user.username,
      token: token
    };
    this.socketIoService.socketEmit(SocketIO.events.user, dataObj);
    console.log(this.user);
  }

  ngOnDestroy() {
    this.socketIoService.closeConnection();
    sessionStorage.clear();
  }


}
