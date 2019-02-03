import {Component, Input, OnInit, AfterViewInit, AfterContentChecked, AfterViewChecked, ElementRef} from '@angular/core';
import * as $ from 'jquery';
import 'fullcalendar';
import {OptionsInput} from 'fullcalendar';

/*
  Generated class for the Calendar component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  template: '<div></div>',
  selector: 'app-angular-fullcalendar'
})

export class CalendarComponent implements OnInit, AfterViewInit, AfterContentChecked, AfterViewChecked {

  @Input() public options: OptionsInput;
  public text: string;
  public calendarInitiated: boolean;

  constructor(private element: ElementRef) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      $('app-angular-fullcalendar').fullCalendar(this.options);
    }, 100);
  }

  ngAfterContentChecked() {
  }
  ngAfterViewChecked() {
  }

  public fullCalendar(...args: any[]) {
    if (!args) {
      return;
    }
    switch (args.length) {
      case 0:
        return;
      case 1:
        return $(this.element.nativeElement).fullCalendar(args[0]);
      case 2:
        return $(this.element.nativeElement).fullCalendar(args[0], args[1]);
      case 3:
        return $(this.element.nativeElement).fullCalendar(args[0], args[1], args[2]);
    }
  }

  public updateEvent(event) {
    return $(this.element.nativeElement).fullCalendar('updateEvent', event);
  }

  public clientEvents(idOrFilter) {
    return $(this.element.nativeElement).fullCalendar('clientEvents', idOrFilter);
  }
}
