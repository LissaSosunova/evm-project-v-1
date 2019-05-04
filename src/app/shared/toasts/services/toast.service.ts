import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition } from '@angular/material';
import { TransferService } from 'src/app/services/transfer.service';
import { ToastSuccessComponent } from '../components/toast-succes/toast-success.component';
import { ToastFailComponent } from '../components/toast-fail/toast-fail.component';
import { ToastWarningComponent } from '../components/toast-warning/toast-warning.component';

@Injectable({
  providedIn: 'root'
})

export class ToastService {
  
  private horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';
  
  constructor(private snackBar: MatSnackBar,
              private transferService: TransferService) { }

  public openToastFail(message: string, duration: number = 3000): void {
    this.transferService.dataSet({name: 'toastMessage', data: message});
    const config: MatSnackBarConfig = this.initToastConfig(duration);
    this.snackBar.openFromComponent(ToastFailComponent, config);
  }

  public openToastSuccess(message: string, duration: number = 3000): void {
    const config: MatSnackBarConfig = this.initToastConfig(duration);
    this.transferService.dataSet({name: 'toastMessage', data: message});
    this.snackBar.openFromComponent(ToastSuccessComponent, config);
  }

  public openToastWarning(message: string, duration: number = 3000): void {
    const config: MatSnackBarConfig = this.initToastConfig(duration);
    this.transferService.dataSet({name: 'toastMessage', data: message});
    this.snackBar.openFromComponent(ToastWarningComponent, config);
  }

  private initToastConfig(duration: number): MatSnackBarConfig {
    const config: MatSnackBarConfig = {
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      duration: duration
    }
    return config;
  }

}
