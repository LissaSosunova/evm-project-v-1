import { Component, OnInit, forwardRef, Input, ViewChild, ElementRef } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-multi-line-input',
  templateUrl: './multi-line-input.component.html',
  styleUrls: ['./multi-line-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiLineInputComponent),
    multi: true
  }]
})
export class MultiLineInputComponent implements OnInit, ControlValueAccessor {

  public onChange: Function;
  public onTouched: Function;
  public text: string;
  public showPlaceholder: boolean = true;
  public currText: string;
  @Input() public placeholder: string; // optional
  @ViewChild('input') public input: ElementRef;
  private inputElement: HTMLDivElement;
  @Input() private minHeight: string; // optional
  @Input() private maxHeight: string; // optional

  constructor() { }

  ngOnInit() {
    this.inputElement = this.input.nativeElement as HTMLDivElement;
    this.minHeight = this.minHeight || '20';
    this.maxHeight = this.maxHeight || '200';
    this.inputElement.style.minHeight = `${this.minHeight}px`;
    this.inputElement.style.maxHeight = `${this.maxHeight}px`;
  }

  public onChangeInput(event: string): void {
    this.currText = event;
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(event);
    }
  }

  public onBlur(): void {
    if (!this.currText) {
      this.showPlaceholder = true;
    }
  }

  public onFocus(): void {
    this.showPlaceholder = false;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(val: string): void {
    if (val) {
      this.text = val;
    }
  }
}
