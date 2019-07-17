import { Component, OnInit, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { InputAbstract, MakeProvider } from '../model/input-abstract';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  providers: [MakeProvider(InputNumberComponent)]
})
export class InputNumberComponent extends InputAbstract implements OnInit {

// max text length for limiting text entering in HTML
@Input() public maxLength?: number = 524288; // default value
// min text length
@Input() public minLength?: number;

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
  this.subscribeFormControlInit();
  this.subscribeForShowingErrorMessages();
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

private subscribeFormControlInit(): void {
  const subscription: Subscription = this.control.valueChanges
  .pipe(debounceTime(this.debounceTime))
  .subscribe(value => {
    if (this.onTouched) {
      this.onTouched();
    }
    this.valueChange.emit(parseFloat(value));
    if (this.onChange) {
      this.onChange(parseFloat(value));
    }
    value = parseFloat(value);
  });
  this.subscriptions.push(subscription);
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
