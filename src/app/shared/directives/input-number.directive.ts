import { Directive, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appInputNumber]'
})
export class InputNumberDirective {

  @Output() public changedStr: EventEmitter<number> = new EventEmitter<number>();

  constructor(private elRef: ElementRef) { }

  @HostListener('input') public onInputChange(): void {
    let source = this.elRef.nativeElement.value;
    if (source !== undefined && source !== null) {
      source = source.match(/-?\d+(\.)?(\d+)?/g);
      setTimeout(() => {
        this.elRef.nativeElement.value = !!source && source.length > 0 ? source : null;
        this.changedStr.emit(!!source && source.length > 0 ? source : null);
      }, 0);
    }
  }

}
