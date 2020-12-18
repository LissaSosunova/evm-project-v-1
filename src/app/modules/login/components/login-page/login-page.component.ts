import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { DataService } from 'src/app/services/data.service';
import { NgForm } from '@angular/forms';
import { ToastService } from 'src/app/modules/shared/toasts/services/toast.service';
import { CookieService } from 'src/app/core/services/cookie.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent implements OnInit, OnDestroy {
  public params: types.Login;
  public token: string;
  public dataResp: types.LoginResp;
  public errorMessage: string;
  public username: string;
  public password: string;
  public isFormValid: boolean;
  public isPendingResponse = false;
  @ViewChild('loginForm', {static: true}) public loginForm: NgForm;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private data: DataService,
              private cookieService: CookieService,
              private toastService: ToastService) {
   }


  ngOnInit() {
    const token = this.cookieService.getCookie('access_token');
    if (token) {
      setTimeout(() => {
        this.router.navigate(['/main/home']);
      });
    }
  }


  ngOnDestroy() {
  }

  public setAuthConf(username: string, password: string): void {
    this.isPendingResponse = true;
      this.params = {
        username,
        password
      };
    this.data.setAuth(this.params).subscribe(
      data => {
        this.dataResp = data as types.LoginResp;
        if (this.dataResp.success) {
          const token = this.dataResp.access_token;
          const tokenKey = this.dataResp.token_key;
          this.cookieService.setCookie('access_token', token, {'max-age': data.expires_in});
          this.cookieService.setCookie('token_key', tokenKey, {'max-age': data.expires_in});
          this.router.navigate(['/main/home']);
        } else {
          this.errorMessage = data.message;
          this.isPendingResponse = false;
        }
      },
      err => {
        this.toastService.openToastFail('Server error');
        this.isPendingResponse = false;
      }
    );
  }

}
