import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/modules/shared/toasts/services/toast.service';
import { RegistrationApiService } from '../../services/registration-api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public email: string;
  public isPendingResponse = false;

  constructor(private toastService: ToastService,
              private registrationApiService: RegistrationApiService) { }

  ngOnInit() {
  }

  public sendEmail(email: string): void {
    this.isPendingResponse = true;
    this.registrationApiService.postRequest('/registration/forgot_password', {email})
    .subscribe(res => {
      if (res.status === 404) {
        this.toastService.openToastFail('Wrong email');
      } else {
        this.toastService.openToastSuccess('Check your email to complete password resetting', {duration: 6000});
      }
      this.isPendingResponse = false;
    }, err => {
      this.toastService.openToastFail('Server error');
      this.isPendingResponse = false;
    });
  }

}
