import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { DataService } from 'src/app/services/data.service';
import { NgForm } from '@angular/forms';
import { ToastService } from 'src/app/shared/toasts/services/toast.service';

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
  @ViewChild('registrationForm') public registrationForm: NgForm;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private data: DataService,
              private toastService: ToastService) {

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
    if (password !== passConf) {
      this.errorMes = 'Passwords must be equal';
      return;
    }

    this.params = {
      name: nameOfUser,
      username,
      email,
      password
    };

    this.data.setReg(this.params).subscribe(
      data => {
        const response = JSON.parse(data);
        if (response.name === 'MongoError' || response.statuscode === 409) {
          this.errorMes = 'User with such username or e-mail is already exists. Try another username or e-mail';
        } else {
          this.toastService.openToastSuccess('Check your email to complete registration', {duration: 6000});
          this.errorMes = '';
        }
      }
    );
  }

}
