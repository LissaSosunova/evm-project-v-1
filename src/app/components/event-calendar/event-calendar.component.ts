import { Component, OnInit } from '@angular/core';
import {OptionsInput} from 'fullcalendar';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss']
})
export class EventCalendarComponent implements OnInit {

  public calendarOptions: OptionsInput;
  constructor() {}

  ngOnInit() {
    this.calendarOptions = {
      height: 455,
      fixedWeekCount : false,
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      header: {
        left: 'month basicWeek basicDay',
        center: 'title',
        right: 'today prev,next'
      },
      // mocked events
      events: [
        {
          title: 'All Day Event',
          start: '2019-09-01'
        },
        {
          title: 'Long Event',
          start: '2019-09-07',
          end: '2019-09-10'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: '2019-09-09T16:00:00'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: '2019-09-16T16:00:00'
        },
        {
          title: 'Conference',
          start: '2019-09-11',
          end: '2019-09-13'
        },
        {
          title: 'Meeting',
          start: '2019-09-12T10:30:00',
          end: '2019-09-12T12:30:00'
        },
        {
          title: 'Lunch',
          start: '2019-09-12T12:00:00'
        },
        {
          title: 'Meeting',
          start: '2019-09-12T14:30:00'
        },
        {
          title: 'Happy Hour',
          start: '2019-09-12T17:30:00'
        },
        {
          title: 'Dinner',
          start: '2019-09-12T20:00:00'
        },
        {
          title: 'Birthday Party',
          start: '2019-09-13T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2019-09-28'
        }
      ]
    };
}

}
