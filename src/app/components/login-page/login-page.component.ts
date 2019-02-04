import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { DataService } from 'src/app/services/data.service';
import { AbstractEditor } from 'src/app/models/abstract-editor';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent extends AbstractEditor implements OnInit, AfterViewInit, OnDestroy {
  public params: types.Login;
  public token: string;
  public dataResp: types.LoginResp;
  public errorMessage: string;
  public username: string;
  public password: string;
  public isFormValid: boolean;
  @ViewChild('loginForm') public loginForm: NgForm;
  private formValueSub: Subscription;
  private validationSub: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService) {
    super();
   }


  ngOnInit() {
    this.doValidate();
  }

  ngAfterViewInit() {
    this.formValueSub = this.loginForm.valueChanges
      .subscribe(value => {
        this.doValidate();
      });
    this.validationSub =  this.isValid$.subscribe(valid => {
        setTimeout(() => {
          this.isFormValid = valid;
        });
      });
  }

  ngOnDestroy() {
    this.formValueSub.unsubscribe();
    this.validationSub.unsubscribe();
  }

  public setAuthConf(username: string, password: string): void {
      this.params = {
        username,
        password
      };
    this.data.setAuth(this.params).subscribe(
      data => {
        console.log(data);
        this.dataResp = data as types.LoginResp;
        if (this.dataResp.success === true) {
          this.token = this.dataResp.access_token;
          sessionStorage.setItem('_token', this.token);
          this.router.navigate(['/main/home']);
        } else {
          this.errorMessage = data.message;
        }
      }
    );
  }

  private doValidate(): void {
    if (!this.loginForm.valid) {
      return this._isValid.next(false);
    }
    this._isValid.next(true);
  }

}
