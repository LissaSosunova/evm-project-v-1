import { Component, OnInit } from '@angular/core';
import { TransferService } from 'src/app/services/transfer.service';

@Component({
  selector: 'app-toast-warning',
  templateUrl: './toast-warning.component.html',
  styleUrls: ['./toast-warning.component.scss']
})
export class ToastWarningComponent implements OnInit {

  public message: string;

  constructor(private transferService: TransferService) { }

  ngOnInit() {
    this.message = this.transferService.dataGet('toastMessage');
  }

}
