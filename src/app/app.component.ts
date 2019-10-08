import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketIoService } from './services/socket.io.service';
import { Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { TransferService } from './services/transfer.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'evm-proj';
  public documentWidth: number;
  public showSpinner: boolean;
  @ViewChild('sidebar', {static: true}) private sidebar: ElementRef;
  @ViewChild('content', {static: true}) private content: ElementRef;
  private sidebarElement: HTMLDivElement;
  private contentElement: HTMLDivElement;
  private unsubscribe$: Subject<void> = new Subject();

  constructor(private socketIoService: SocketIoService,
              private router: Router,
              private transferService: TransferService) {

  }

  ngOnInit() {
    this.changeSidebarPosition();
    window.onresize = event => {
      this.changeSidebarPosition();
    };
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        this.showSpinner = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.showSpinner = false;
      }
      this.transferService.dataObj$.pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        if (res.popupOpen) {
          this.showSpinner = false;
        }
      });
    });
  }

  ngOnDestroy() {
    this.socketIoService.closeConnection();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private changeSidebarPosition(): void {
    this.sidebarElement = this.sidebar.nativeElement as HTMLDivElement;
    this.contentElement = this.content.nativeElement as HTMLDivElement;
    this.documentWidth = document.documentElement.clientWidth;
    if (this.documentWidth < 500) {
      this.sidebarElement.style.position = 'fixed';
      this.sidebarElement.style.zIndex = '5';
      this.contentElement.style.paddingLeft = '90px';
    } else {
      this.sidebarElement.style.position = 'static';
      this.contentElement.style.paddingLeft = '30px';
    }
  }

}
