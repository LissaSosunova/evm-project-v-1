import { Component, OnDestroy } from '@angular/core';
import { SocketIoService } from './services/socket.io.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnDestroy {
  title = 'evm-proj';

  constructor(private socketIoService: SocketIoService) {

  }

  ngOnDestroy() {
    this.socketIoService.closeConnection();
  }
}
