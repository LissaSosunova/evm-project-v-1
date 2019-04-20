import { Input, Output, EventEmitter, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export abstract class InputAbstract implements ControlValueAccessor, OnDestroy {
  /**
   * Floating strategy
   * @see https://material.angular.io/components/form-field/overview#floating-label
   */
  @Input() public floatLabel?: 'never' | 'always' | 'auto' = 'auto';
  // for disabling input when FormControl is not passed
  @Input() public disabled?: boolean = false;
  // for form validation when FormControl is not passed
  @Input() public required?: boolean = false;
  // input value, if form contol is not used
  @Input() public value?: string;
  /**
   * Floating label.
   * Will be hidden if omitted.
   */
  @Input() public label?: string;

  @Input() public control?: FormControl;

  @Input() public placeholder?: string = '';
  // for placeholder asterisk, will be hidden if true
  @Input() public noAsterisk?: boolean = false;

  @Input() public requiredFieldError: string = 'Required field';

  @Input() public debounceTime?: number = 500;

  @Output() public valueChange: EventEmitter<string> = new EventEmitter<string>();

  protected subscriptions: Subscription[] = [];
  protected validatorsConfig: any[] = [];

  // For NG_VALUE_ACCESSOR
  private onChange: (value: string) => void;
  private onTouched: () => void;

  constructor() {}

  public ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public init(): void {
    if (!this.control) {
      const inputValue: {value: string, disabled?: boolean} = {} as {value: string, disabled?: boolean};
      if (this.required) {
        this.validatorsConfig.push(Validators.required);
      }
      if (this.value) {
        inputValue.value = this.value;
      } else {
        inputValue.value = '';
      }
      if (this.disabled) {
        inputValue.disabled = true;
      } else {
        inputValue.disabled = false;
      }
      this.control = new FormControl(inputValue, this.validatorsConfig);
    }
  }

  public subscribeFormControl(): void {
    const subscription: Subscription = this.control.valueChanges
    .pipe(debounceTime(this.debounceTime))
    .subscribe(value => {
      if (this.onTouched) {
        this.onTouched();
      }
      this.valueChange.emit(value);
      if (this.onChange) {
        this.onChange(value);
      }
    });
    this.subscriptions.push(subscription);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(val: string): void {
    if (val !== undefined) {
        this.control.setValue(val);
    }
  }
}

export function MakeProvider(type: any) {
    return {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => type),
      multi: true
    };
  }
