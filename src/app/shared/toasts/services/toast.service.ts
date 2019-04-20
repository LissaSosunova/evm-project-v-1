import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TransferService } from 'src/app/services/transfer.service';
import { ToastSuccessComponent } from '../components/toast-succes/toast-success.component';
import { ToastFailComponent } from '../components/toast-fail/toast-fail.component';
import { ToastWarningComponent } from '../components/toast-warning/toast-warning.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private snackBar: MatSnackBar,
              private transferService: TransferService) { }

  public openToastFail(message: string, duration: number = 3000): void {
    this.transferService.dataSet({name: 'toastMessage', data: message});
    this.snackBar.openFromComponent(ToastFailComponent, { duration: duration, panelClass: ['toast-box'] });
  }

  public openToastSuccess(message: string, duration: number = 3000): void {
    this.transferService.dataSet({name: 'toastMessage', data: message});
    this.snackBar.openFromComponent(ToastSuccessComponent, { duration: duration, panelClass: ['toast-box'] });
  }

  public openToastWarning(message: string, duration: number = 3000): void {
    this.transferService.dataSet({name: 'toastMessage', data: message});
    this.snackBar.openFromComponent(ToastWarningComponent, { duration: duration, panelClass: ['toast-box'] });
  }

}
