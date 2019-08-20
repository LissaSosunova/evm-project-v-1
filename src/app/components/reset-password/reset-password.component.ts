import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastService } from 'src/app/shared/toasts/services/toast.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public password: string;
  public confPassword: string;

  private token: string;
  private tokenTime: string;
  @ViewChild('resetPasswordForm') private resetPasswordForm: NgForm;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private toastService: ToastService,
              private dataService: DataService) { }

  ngOnInit() {
    this.token = this.route.snapshot.params.token;
    this.tokenTime = this.route.snapshot.params.tokenTime;
  }

  public sendPasswords(): void {
    if (this.resetPasswordForm.value.pass !== this.resetPasswordForm.value.confPass) {
      this.toastService.openToastFail('Passwords must be equal');
      return;
    }
    this.dataService.changePassword(this.resetPasswordForm.value.pass, this.token, this.tokenTime).subscribe(res => {
      if (res.status === 200) {
        this.toastService.openToastSuccess('Your password has been changed!');
        this.router.navigate(['/login']);
      } else {
        this.toastService.openToastFail('Server error');
      }
    },
    err => {
      if (err.status === 401) {
        this.toastService.openToastFail('Invalid token!');
      }
    });
  }

}
