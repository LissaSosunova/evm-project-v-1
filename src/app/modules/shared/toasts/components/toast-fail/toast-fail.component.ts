import { Component, OnInit } from '@angular/core';
import { TransferService } from 'src/app/services/transfer.service';

@Component({
  selector: 'app-toast-fail',
  templateUrl: './toast-fail.component.html',
  styleUrls: ['./toast-fail.component.scss']
})
export class ToastFailComponent implements OnInit {

  public message: string;

  constructor(private transferService: TransferService) { }

  ngOnInit() {
    this.message = this.transferService.dataGet('toastMessage');
  }

}
