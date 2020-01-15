import { Directive, ElementRef, Input, Output, EventEmitter, SimpleChanges, HostListener, OnChanges } from '@angular/core';

@Directive({
  selector: '[appContenteditableModel]'
})

export class ContenteditableModelDirective implements OnChanges {

  @Input() public text: string;
  @Output() public changeInput = new EventEmitter();

  constructor(private elRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.text && changes.text.currentValue) {
      this.elRef.nativeElement.innerText = changes.text.currentValue;
    }
  }

  @HostListener ('keyup', ['$event']) public onKeyup(event: KeyboardEvent): void {
    const value = this.elRef.nativeElement.innerText;
    this.changeInput.emit(value);
    if (event.shiftKey && event.key === 'Enter') {
      return;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.elRef.nativeElement.innerText = '';
    }
  }

}
