import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import { OnInit, forwardRef, Component, NgZone, ViewChild, SimpleChanges, ElementRef, Output, EventEmitter, OnChanges, Input } from '@angular/core';
import { InputAbstract, MakeProvider } from '../model/input-abstract';
import {take} from 'rxjs/operators';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

/** @title Auto-resizing textarea */
@Component({
  selector: 'text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextFieldComponent),
    multi: true
  }]
})
export class TextFieldComponent extends InputAbstract implements OnInit, OnChanges, ControlValueAccessor {
  @Output() public reset: EventEmitter<void> = new EventEmitter<void>();
  public isValue: boolean = false;
  @Input() public maxLength?: number = 500; // default value
  @Input() text: string;
  private inputElement: HTMLInputElement;


  @ViewChild('input', {static: true}) public input: ElementRef;
  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;
  constructor(private _ngZone: NgZone) {
    super();
  }

  ngOnInit() {
    this.inputElement = this.input.nativeElement as HTMLInputElement;
    super.init();
    super.subscribeFormControl();

  }
  ngOnChanges(changes: SimpleChanges) {
    if (!changes.text.isFirstChange()) {
      setTimeout(() => {
        this.text = this.input.nativeElement.innerHTML;
      });
    }
  }
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  writeMessage($event) {
    this.text = this.input.nativeElement.innerHTML;
  }
}