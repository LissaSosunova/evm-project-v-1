import { Component, OnInit, Input } from '@angular/core';
import { InputAbstract, MakeProvider } from '../model/input-abstract';
import { Validators, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-input-email',
  templateUrl: './input-email.component.html',
  styleUrls: ['./input-email.component.scss'],
  providers: [MakeProvider(InputEmailComponent),
          {provide: NG_VALIDATORS, useExisting: InputEmailComponent, multi: true}]
})

export class InputEmailComponent extends InputAbstract implements OnInit, Validator {

  @Input() public invalidEmailError?: string = 'Invalid email';
  @Input() public emailValidator?: boolean = true;

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.emailValidator) {
      this.validatorsConfig.push(Validators.email);
    }
    super.init();
    super.subscribeFormControl();
  }

  public validate(value: AbstractControl): ValidationErrors | null {
    return Validators.email(value);
 }

}
