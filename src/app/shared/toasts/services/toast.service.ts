import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition, } from '@angular/material';
import { TransferService } from 'src/app/services/transfer.service';
import { ToastSuccessComponent } from '../components/toast-succes/toast-success.component';
import { ToastFailComponent } from '../components/toast-fail/toast-fail.component';
import { ToastWarningComponent } from '../components/toast-warning/toast-warning.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  duration: number = 3000;
  message: string;
  constructor(private snackBar: MatSnackBar,
              private transferService: TransferService) { }

  public openToastFail(message: string): void {
    this.transferService.dataSet({name: 'toastMessage', data: message});
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.duration;
    config.panelClass = ['toast-box'];
    this.snackBar.openFromComponent(ToastFailComponent, config);
  }

  public openToastSuccess(message: string): void {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.duration;
    config.panelClass = ['toast-box'];
    this.transferService.dataSet({name: 'toastMessage', data: message});
    this.snackBar.openFromComponent(ToastSuccessComponent, config);
  }

  public openToastWarning(message: string): void {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.duration;
    config.panelClass = ['toast-box'];
    this.transferService.dataSet({name: 'toastMessage', data: message});
    this.snackBar.openFromComponent(ToastWarningComponent, config);
  }
}
