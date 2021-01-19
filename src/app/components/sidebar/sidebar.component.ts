import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterService } from 'src/app/services/router.service';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { TransferService } from 'src/app/services/transfer.service';
import { SocketIO} from 'src/app/types/socket.io.types';
import { PageMaskService } from 'src/app/services/page-mask.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CookieService } from 'src/app/core/services/cookie.service';
import { SessionStorageService } from 'src/app/services/session.storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  public currParentUrl: string;
  public currChildUrl: string;
  public contactsAwaiting: number;
  public sidebarIsExpanded: boolean;
  public totalUnreadMessagesAmount: number;
  @Input() private documentWidth: number;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(public router: Router,
            private activateRouter: ActivatedRoute,
            private routerService: RouterService,
            private socketIoService: SocketIoService,
            private transferService: TransferService,
            private pageMaskService: PageMaskService,
            private cookieService: CookieService,
            private sessionStorageService: SessionStorageService) { }

  ngOnInit() {
    this.getCurrentRoute();
    this.setSidebarPosition();
    this.transferService.dataObj$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(obj => {
      if (obj.allUnredMessagesAmount || obj.allUnredMessagesAmount === 0) {
        this.totalUnreadMessagesAmount = obj.allUnredMessagesAmount;
      }
      if (obj.name === 'awaitingContacts') {
        this.contactsAwaiting = obj.data;
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public exit(): void {
    const userData  = this.transferService.dataGet('userData');
    const dataObj = {
      userId: userData.username,
    };
    this.socketIoService.socketEmit(SocketIO.events.user_left, dataObj);
    this.cookieService.deleteCookie('access_token_valid');
    this.sessionStorageService.clearSessionStorage();
  }

  public onClickOutside(event: MouseEvent): void {
    if (this.documentWidth < 500 && this.sidebarIsExpanded) {
      this.sidebarIsExpanded = false;
      this.transferService.setDataObs({toggleSidebarState: this.sidebarIsExpanded});
      this.pageMaskService.close();
    }
  }

  public toggleSidebar(): void {
    this.sidebarIsExpanded = !this.sidebarIsExpanded;
    if (this.documentWidth < 500 && this.sidebarIsExpanded) {
      this.transferService.setDataObs({toggleSidebarState: this.sidebarIsExpanded});
      this.pageMaskService.open();
    } else if (this.documentWidth < 500 && !this.sidebarIsExpanded) {
      this.transferService.setDataObs({toggleSidebarState: this.sidebarIsExpanded});
      this.pageMaskService.close();
    }
 }

 private getCurrentRoute(): void {
  this.routerService.getCurrentRoute$().subscribe(url => {
    const urlSegments = url.split('/');
    this.currParentUrl = urlSegments[1];
    if (this.currParentUrl === '/' || !this.currParentUrl) {
      this.currParentUrl = 'login';
      const access_token_valid = this.cookieService.getCookie('access_token_valid');
      if (access_token_valid) {
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

  private setSidebarPosition(): void {
    this.documentWidth = document.documentElement.clientWidth;
    if (this.documentWidth < 500) {
      this.sidebarIsExpanded = false;
    } else {
      this.sidebarIsExpanded = true;
    }
  }

}
