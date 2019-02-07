import { Directive, ElementRef, Input, Output, EventEmitter, SimpleChanges, HostListener, OnChanges } from '@angular/core';

@Directive({
  selector: '[appContenteditableModel]'
})

export class ContenteditableModelDirective implements OnChanges {

  @Input() public text: string;
  @Output() public changeInput = new EventEmitter();

  constructor(private elRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.text.currentValue) {
      this.elRef.nativeElement.innerText = changes.text.currentValue;
    }
  }

  @HostListener ('keyup') public onKeyup() {
    const value = this.elRef.nativeElement.innerText;
    this.changeInput.emit(value);
  }

}
