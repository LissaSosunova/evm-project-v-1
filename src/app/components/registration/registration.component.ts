import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { types } from 'src/app/types/types';
import { DataService } from 'src/app/services/data.service';
import { NgForm } from '@angular/forms';
import { AbstractEditor } from 'src/app/models/abstract-editor';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent extends AbstractEditor implements OnInit, AfterViewInit, OnDestroy {
  public email: string;
  public errorMes: string;
  public isFormValid: boolean;
  public name: string;
  public params: types.Registration;
  public passConf: string;
  public password: string;
  public username: string;
  @ViewChild('registrationForm') public registrationForm: NgForm;
  private formValueSub: Subscription;
  private validationSub: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService) {
    super();
   }

    ngOnInit() {

    }

    ngAfterViewInit() {
      this.formValueSub = this.registrationForm.valueChanges
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
          this.errorMes = 'User with such username is already exists. Try another username';
        } else {
          this.router.navigate(['../login']);
        }
      }
    );
  }

  private doValidate(): void {
    if (!this.registrationForm.valid) {
      return this._isValid.next(false);
    }
    this._isValid.next(true);
  }

}
