import { Component, OnInit } from '@angular/core';
import { TransferService } from 'src/app/services/transfer.service';
import { types } from 'src/app/types/types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-message-toast',
  templateUrl: './new-message-toast.component.html',
  styleUrls: ['./new-message-toast.component.scss']
})
export class NewMessageToastComponent implements OnInit {

  public messageObj: types.ContactForToastMessage;

  constructor(private transferService: TransferService, private router: Router) { }

  ngOnInit() {
    this.messageObj = this.transferService.dataGet('toastMessage');
  }

  public goToChat(chatId: string): void {
    this.router.navigate([`/main/chat-window/${chatId}`]);
  }

}
