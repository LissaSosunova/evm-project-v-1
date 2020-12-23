import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastService } from 'src/app/modules/shared/toasts/services/toast.service';
import { RegistrationApiService } from '../../services/registration-api.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public password: string;
  public confPassword: string;
  public isPendingResponse = false;
  private token: string;
  private tokenTime: string;
  @ViewChild('resetPasswordForm', {static: true}) private resetPasswordForm: NgForm;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private toastService: ToastService,
              private registrationApiService: RegistrationApiService) { }

  ngOnInit() {
    this.token = this.route.snapshot.params.token;
    this.tokenTime = this.route.snapshot.params.tokenTime;
  }

  public sendPasswords(): void {
    this.isPendingResponse = true;
    if (this.resetPasswordForm.value.pass !== this.resetPasswordForm.value.confPass) {
      this.toastService.openToastFail('Passwords must be equal');
      this.isPendingResponse = false;
      return;
    }
    const headers = new HttpHeaders({'authorization': this.token});
    this.registrationApiService.postRequest('/registration/change_password', {password: this.resetPasswordForm.value.pass, tokenTime: this.tokenTime}, headers)
    .subscribe(res => {
      if (res.status === 200) {
        this.toastService.openToastSuccess('Your password has been changed!');
        this.router.navigate(['/login']);
      } else {
        this.toastService.openToastFail('Server error');
      }
      this.isPendingResponse = false;
    },
    err => {
      if (err.status === 401) {
        this.toastService.openToastFail('Invalid token!');
      }
      this.isPendingResponse = false;
    });
  }

}
