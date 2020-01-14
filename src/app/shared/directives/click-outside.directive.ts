import { Directive, OnInit, OnDestroy, Output, EventEmitter, ElementRef } from '@angular/core';
import {fromEvent as observableFromEvent} from 'rxjs';
import {tap} from 'rxjs/operators';
import {delay} from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective implements OnInit, OnDestroy {

  private listening: boolean;
  private globalClick: Subscription;

  @Output() private mClickOutside: EventEmitter<Event>;

  constructor(private _elRef: ElementRef) {
    this.listening = false;
    this.mClickOutside = new EventEmitter<Event>();
  }

  public ngOnInit() {
    this.globalClick = observableFromEvent(document, 'click').pipe(
      delay(1),
      tap(() => {
        this.listening = true;
      }), ).subscribe((event: MouseEvent) => {
        this.onGlobalClick(event);
      });
  }

  public ngOnDestroy() {
    this.globalClick.unsubscribe();
  }

  public onGlobalClick(event: MouseEvent) {
    if (event instanceof MouseEvent && this.listening === true) {
      if (this.isDescendant(this._elRef.nativeElement, event.target) === true) {
        return;
      } else {
        this.mClickOutside.emit(event);
      }
    }
  }

  private isDescendant(parent, child) {
    let node = child;
    while (node !== null) {
      if (node === parent) {
        return true;
      } else {
        node = node.parentNode;
      }
    }
    return false;
  }

}
