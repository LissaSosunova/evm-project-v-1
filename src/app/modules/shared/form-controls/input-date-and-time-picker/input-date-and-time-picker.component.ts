import { Component, NgZone, OnInit, ViewChild, Input, forwardRef, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-input-date-and-time-picker',
  templateUrl: './input-date-and-time-picker.component.html',
  styleUrls: ['./input-date-and-time-picker.component.css'],
  providers: [{provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputDateAndTimePickerComponent),
    multi: true}]
})
export class InputDateAndTimePickerComponent implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit {

  @ViewChild('picker') picker: any;
  @Output() public dateChange: EventEmitter<any> = new EventEmitter<any>();

  public localDateStr: string;
  public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  @Input() public disableSecond: boolean;
  @Input() public placeholder?: string;
  private unsubscribe$: Subject<void> = new Subject();
  // For NG_VALUE_ACCESSOR
  private onChange: (value: string) => void;
  private onTouched: () => void;
  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required])
  })
  @Input() public control?: FormControl;
  @Input() public value?: Date | number;
  @Input() public format = 'M/d/yy, h:mm a';


  constructor(
    private zone: NgZone,
    private datePipe: DatePipe) {
  }

 
  ngOnInit() {
    this.init();
  }

  ngAfterViewInit() {

  }

  closePicker() {
    this.picker.cancel();
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
      this.control = new FormControl({value: this.value, disabled: this.disabled});
      this.initFormControl();
    }
  }

  private initFormControl(): void {
    this.control.valueChanges.pipe(takeUntil(this.unsubscribe$))
    .subscribe(value => {
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
