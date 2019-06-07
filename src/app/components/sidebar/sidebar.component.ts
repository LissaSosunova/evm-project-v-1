import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SessionStorageService } from 'src/app/services/session.storage.service';
import { RouterService } from 'src/app/services/router.service';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { TransferService } from 'src/app/services/transfer.service';
import { types } from 'src/app/types/types';
import { SocketIO} from 'src/app/types/socket.io.types';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public currParentUrl: string;
  public currChildUrl: string;

  constructor(public router: Router,
            private activateRouter: ActivatedRoute,
            private sessionStorageService: SessionStorageService,
            private routerService: RouterService,
            private socketIoService: SocketIoService,
            private transferService: TransferService) { }

  ngOnInit() {
    this.routerService.getCurrentRoute$().subscribe(url => {
      const urlSegments = url.split('/');
      this.currParentUrl = urlSegments[1];
      if (this.currParentUrl === '/' || !this.currParentUrl) {
        this.currParentUrl = 'login';
        const token = this.sessionStorageService.getValue('_token');
        if (token) {
          this.currParentUrl = 'main';
        }
      }
      if (urlSegments.length > 2) {
        this.currChildUrl = urlSegments[2];
        const childSegments = this.currChildUrl.split('?');
        this.currChildUrl = childSegments[0];
      } else {
        this.currChildUrl = '';
      }
    });
  }

  public exit(): void {
    const userData  = this.transferService.dataGet('userData');
    const token = this.sessionStorageService.getValue('_token');
    const dataObj = {
      userId: userData.username,
      token: token
    };
    this.socketIoService.socketEmit(SocketIO.events.user_left, dataObj);
  }

}
