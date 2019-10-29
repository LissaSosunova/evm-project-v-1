import { Component, OnInit, forwardRef, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
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
export class MultiLineInputComponent implements OnInit, OnChanges, ControlValueAccessor {

  public onChange: Function;
  public onTouched: Function;
  @Input() text: string;
  public showPlaceholder: boolean = true;
  public currText: string;
  @Input() public placeholder: string; // optional
  @Input() public currMes: string;
  @ViewChild('input', {static: true}) public input: ElementRef;
  private inputElement: HTMLInputElement;
  private isInputFocused: boolean = false;
  @Input() private minHeight: string; // optional
  @Input() private maxHeight: string; // optional
  @Output() public enterKey: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
    this.inputElement = this.input.nativeElement as HTMLInputElement;
    this.minHeight = this.minHeight || '20';
    this.maxHeight = this.maxHeight || '200';
    this.inputElement.style.minHeight = `${this.minHeight}px`;
    this.inputElement.style.maxHeight = `${this.maxHeight}px`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.inputElement && !this.isInputFocused && changes.currMes.currentValue === '' && !changes.currMes.isFirstChange()) {
      this.inputElement.innerHTML = changes.currMes.currentValue;
      this.currText = '';
      this.showPlaceholder = true;
    } else if (this.inputElement && changes.currMes.currentValue !== '' && !changes.currMes.isFirstChange()) {
      this.showPlaceholder = false;
    } else if (this.inputElement && changes.currMes.currentValue === '' && !changes.currMes.isFirstChange()) {
      this.currText = '';
    }
  }

  public onChangeInput(event: string): void {
    this.currText = event;
    this.currText = this.currText.replace(/\n\n\n/, '');
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
    this.isInputFocused = false;
  }

  public onEnter(event: KeyboardEvent): void {
    if (event.shiftKey && event.key === 'Enter') {
      return;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.enterKey.emit();
      this.isInputFocused = true;
      setTimeout(() => {
        this.inputElement.focus();
      });
    }
  }

  public onFocus(): void {
    this.isInputFocused = true;
    this.showPlaceholder = false;
    setTimeout(() => {
      this.inputElement.focus();
    });
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
      this.showPlaceholder = false;
    }
  }
}
