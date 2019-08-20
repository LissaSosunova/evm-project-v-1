import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ToastService } from 'src/app/shared/toasts/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public email: string;

  constructor(private dataService: DataService,
              private toastService: ToastService) { }

  ngOnInit() {
  }

  public sendEmail(email: string): void {
    this.dataService.forgotPassword(email).subscribe(res => {
      if (res.status === 404) {
        this.toastService.openToastFail('Wrong email');
      } else {
        this.toastService.openToastSuccess('Check your email to complete password resetting', {duration: 6000});
      }
    }, err => {
      this.toastService.openToastFail('Server error');
    });
  }

}
