import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { TransferService } from 'src/app/services/transfer.service';
import { ToastSuccessComponent } from '../components/toast-succes/toast-success.component';
import { ToastFailComponent } from '../components/toast-fail/toast-fail.component';
import { ToastWarningComponent } from '../components/toast-warning/toast-warning.component';
import { NewMessageToastComponent } from '../components/new-message-toast/new-message-toast.component';
import { types } from 'src/app/types/types';

@Injectable()

export class ToastService {

  // default config
  private horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';
  private duration = 3000;

  constructor(private snackBar: MatSnackBar,
              private transferService: TransferService) { }

  public openToastFail(message: string, config?: MatSnackBarConfig): void {
    this.transferService.dataSet({name: 'toastMessage', data: message});
    config = this.initToastConfig(config);
    this.snackBar.openFromComponent(ToastFailComponent, config);
  }

  public openToastSuccess(message: string, config?: MatSnackBarConfig): void {
    config = this.initToastConfig(config);
    this.transferService.dataSet({name: 'toastMessage', data: message});
    this.snackBar.openFromComponent(ToastSuccessComponent, config);
  }

  public openToastWarning(message: string, config?: MatSnackBarConfig): void {
    config = this.initToastConfig(config);
    this.transferService.dataSet({name: 'toastMessage', data: message});
    this.snackBar.openFromComponent(ToastWarningComponent, config);
  }

  public openMessageToast(obj: types.ContactForToastMessage, config?: MatSnackBarConfig): void {
    config = this.initToastConfig(config);
    this.transferService.dataSet({name: 'toastMessage', data: obj});
    this.snackBar.openFromComponent(NewMessageToastComponent, config);
  }

  private initToastConfig(config?: MatSnackBarConfig): MatSnackBarConfig {
    config = config || {} as MatSnackBarConfig;
    config.verticalPosition = config.verticalPosition || this.verticalPosition;
    config.horizontalPosition = config.horizontalPosition || this.horizontalPosition;
    config.duration = config.duration || this.duration;
    return config;
  }

}
