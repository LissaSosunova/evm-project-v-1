import { Component, OnInit } from '@angular/core';
import { TransferService } from 'src/app/services/transfer.service';

@Component({
  selector: 'app-toast-success',
  templateUrl: './toast-success.component.html',
  styleUrls: ['./toast-success.component.scss']
})

export class ToastSuccessComponent implements OnInit {

  public message: string;

  constructor(private transferService: TransferService) { }

  ngOnInit() {
    this.message = this.transferService.dataGet('toastMessage');
  }

}
