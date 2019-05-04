import { Component, OnInit, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { InputAbstract, MakeProvider } from '../model/input-abstract';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss'],
  providers: [MakeProvider(InputPasswordComponent)]
})
export class InputPasswordComponent extends InputAbstract implements OnInit {

// max text length for limiting text entering in HTML
@Input() public maxLength?: number = 524288; // default value
// min text length
@Input() public minLength?: number;
// for toggling input type
public hide: boolean = true;

public showMaxInputMessageError: boolean = false;
public maxLengthLimit: number;

constructor() {
  super();
}

ngOnInit() {
  if (this.maxLength) {
    this.validatorsConfig.push(Validators.maxLength(this.maxLength));
  }
  if (this.minLength) {
    this.validatorsConfig.push(Validators.minLength(this.minLength));
  }
  super.init();
  super.subscribeFormControl();
  this.subscribeForShowingErrorMessages();
}

public toggleInputType(): void {
  this.hide = !this.hide;
}

public get minLengthError(): string {
  return `Minimun ${this.control.errors.minlength.requiredLength} characters`;
}

private showErrorMessages(inputValueLength: number, maxLength: number | undefined): void {
  if (maxLength && inputValueLength === maxLength) {
    this.showMaxInputMessageError = true;
    this.maxLengthLimit = maxLength;
  } else if (this.control.errors && this.control.errors.maxlength) {
    this.maxLengthLimit = this.control.errors.maxlength.requiredLength;
  } else {
    this.showMaxInputMessageError = false;
  }
}

private subscribeForShowingErrorMessages(): void {
  const subscription: Subscription = this.control.valueChanges.subscribe(value => {
    value = value || '';
    const inputValueLength: number = value.length;
    this.showErrorMessages(inputValueLength, this.maxLength);
  });
  this.subscriptions.push(subscription);
}

}
