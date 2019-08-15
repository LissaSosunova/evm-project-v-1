import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketIoService } from './services/socket.io.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'evm-proj';
  public documentWidth: number;
  @ViewChild('sidebar') private sidebar: ElementRef;
  @ViewChild('content') private content: ElementRef;
  private sidebarElement: HTMLDivElement;
  private contentElement: HTMLDivElement;

  constructor(private socketIoService: SocketIoService) {

  }

  ngOnInit() {
    this.changeSidebarPosition();
    window.onresize = event => {
      this.changeSidebarPosition();
    };
  }

  ngOnDestroy() {
    this.socketIoService.closeConnection();
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
