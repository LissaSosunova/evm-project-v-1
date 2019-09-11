import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, OnChanges } from '@angular/core';
import { InputAbstract, MakeProvider } from '../model/input-abstract';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss'],
  providers: [MakeProvider(InputSearchComponent)]
})

export class InputSearchComponent extends InputAbstract implements OnInit, OnChanges {

  @Output() public reset: EventEmitter<void> = new EventEmitter<void>();

  public isValue: boolean = false;

  @ViewChild('searchInput', {static: true}) private input: ElementRef;

  constructor() {
    super();
   }

  ngOnChanges() {
    if (typeof this.value === 'string' && this.value.length > 0) {
      this.isValue = true;
    } else {
      this.isValue = false;
    }
  }

  ngOnInit() {
    super.init();
    super.subscribeFormControl();
    setTimeout(() => {
      this.isValue = !!this.control.value;
    });
    this.disabled = this.disabled || this.control.disabled;
  }

  public onChangeInput(value: string): void {
    this.isValue = !!value.length;
  }

  public onReset(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled) {
      this.isValue = false;
      this.input.nativeElement.value = '';
      this.control.setValue('');
      this.reset.emit();
    }
  }

}
