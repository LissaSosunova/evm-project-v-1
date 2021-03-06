import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { NgForm } from '@angular/forms';
import { ToastService } from 'src/app/modules/shared/toasts/services/toast.service';
import { RegistrationApiService } from '../../services/registration-api.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent implements OnInit, AfterViewInit, OnDestroy {
  public email: string;
  public errorMes: string;
  public isFormValid: boolean;
  public name: string;
  public params: types.Registration;
  public passConf: string;
  public password: string;
  public username: string;
  public nameOfUser: string;
  public isPendingResponse = false;
  @ViewChild('registrationForm', {static: true}) public registrationForm: NgForm;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private toastService: ToastService,
              private registrationApiService: RegistrationApiService) {

   }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    ngOnDestroy() {
    }

  public clear(event: MouseEvent): void {
    this.registrationForm.reset();
  }

  public setRegConf (nameOfUser: string, username: string, email: string, password: string, passConf: string): void {
    this.isPendingResponse = true;
    if (password !== passConf) {
      this.errorMes = 'Passwords must be equal';
      this.isPendingResponse = false;
      return;
    }

    this.params = {
      name: nameOfUser,
      username,
      email,
      password
    };

    this.registrationApiService.postRequest('/registration/user/', this.params)
    .subscribe(
      data => {
        const response = data;
        if (response.message === 'MongoError' || response.status === 409) {
          this.errorMes = 'User with such username or e-mail is already exists. Try another username or e-mail';
        } else {
          this.toastService.openToastSuccess('Check your email to complete registration', {duration: 6000});
          this.errorMes = '';
        }
        this.isPendingResponse = false;
      },
      err => {
        this.toastService.openToastFail('Server error');
      }
    );
  }

}
