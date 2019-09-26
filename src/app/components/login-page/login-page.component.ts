import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { DataService } from 'src/app/services/data.service';
import { NgForm } from '@angular/forms';
import { SessionStorageService } from 'src/app/services/session.storage.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent implements OnInit, AfterViewInit, OnDestroy {
  public params: types.Login;
  public token: string;
  public dataResp: types.LoginResp;
  public errorMessage: string;
  public username: string;
  public password: string;
  public isFormValid: boolean;
  public isPendingResponse: boolean = false;
  @ViewChild('loginForm', {static: true}) public loginForm: NgForm;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private data: DataService,
              private sessionStorageService: SessionStorageService) {
   }


  ngOnInit() {

  }

  ngAfterViewInit() {

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
          this.token = this.dataResp.access_token;
          const tokenKey = this.dataResp.token_key;
          this.sessionStorageService.setValue(this.token, '_token');
          this.sessionStorageService.setValue(tokenKey, 'token_key');
          this.router.navigate(['/main/home']);
        } else {
          this.errorMessage = data.message;
          this.isPendingResponse = false;
        }
      }
    );
  }

}
