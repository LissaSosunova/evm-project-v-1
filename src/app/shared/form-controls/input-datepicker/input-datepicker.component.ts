import { Component, OnInit, ViewChild, Input, OnDestroy, Output, EventEmitter, forwardRef, AfterViewInit } from '@angular/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-input-datepicker',
  templateUrl: './input-datepicker.component.html',
  styleUrls: ['./input-datepicker.component.scss'],
  providers: [{provide: NG_VALUE_ACCESSOR,
              useExisting: forwardRef(() => InputDatepickerComponent),
              multi: true}]
})
export class InputDatepickerComponent implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit {

  /**
   * Floating strategy
   * @see https://material.angular.io/components/form-field/overview#floating-label
   */
  @Input() public floatLabel?: 'never' | 'always' | 'auto' = 'never';
  @Input() public errorText?: string = 'Date is required';
  // date pipe format
  @Input() public format?: string = 'EEE, MMMM d yyyy';
  // for form validation when FormControl is not passed
  @Input() public required?: boolean;
  // for disabling datepicker when FormControl is not passed
  @Input() public disabled?: boolean;
  @Input() public control?: FormControl;
  // start date of clickable dates
  @Input() public min?: Date;
  // end date of clickable dates
  @Input() public max?: Date;
  // selected date to display
  @Input() public value?: Date | number;

  @Input() public placeholder?: string;
  // https://material.angular.io/components/datepicker/api dateChange
  @Output() public dateChange: EventEmitter<MatDatepickerInputEvent<Date>> = new EventEmitter<MatDatepickerInputEvent<Date>>();

  public localDateStr: string;

  @ViewChild('datepicker', {static: true}) private datepicker: MatDatepicker<Date>;
  // for unsubscribe all subscriptions
  private unsubscribe$: Subject<void> = new Subject();
  // For NG_VALUE_ACCESSOR
  private onChange: (value: string) => void;
  private onTouched: () => void;

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    this.init();
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public openDatePicker(event): void {
    if (!this.disabled) {
      this.datepicker.open();
    }
    event.target.blur();
  }

  private init(): void {
    if (this.control) {
      const selectedDate = this.control.value;
      if (selectedDate) {
        this.localDateStr = this.datePipe.transform(selectedDate, this.format);
        this.value = selectedDate;
      } else {
        this.initSelectedDate();
      }
      this.initFormControl();
    } else {
      this.initSelectedDate();
      if (this.required) {
        this.control = new FormControl({value: this.value, disabled: this.disabled}, Validators.required);
      } else {
        this.control = new FormControl({value: this.value, disabled: this.disabled});
      }
      this.initFormControl();
    }
  }

  private initFormControl(): void {
    this.control.valueChanges.pipe(takeUntil(this.unsubscribe$))
    .subscribe(value => {
      console.log(value);
      this.dateChange.emit(value);
      this.localDateStr = this.datePipe.transform(value, this.format);
      if (this.onChange) {
        this.onChange(value);
      }
      if (this.onTouched) {
        this.onTouched();
      }
    });
  }

  private initSelectedDate(): void {
    if (this.value) {
      this.localDateStr = this.datePipe.transform(this.value, this.format);
    } else {
      this.localDateStr = '';
    }
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
