import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {OptionsInput} from 'fullcalendar';
import { types } from 'src/app/types/types';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CalendarComponent } from '../calendar/calendar';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss']
})

export class EventCalendarComponent implements OnInit, OnDestroy {

  public calendarOptions: OptionsInput;
  public user: types.User;
  private user$: Observable<types.User>;
  private unsubscribe$: Subject<void> = new Subject();
  @ViewChild('calendar', {static: true}) public calendar: CalendarComponent;

  constructor(private store: Store<types.User>) {}

  ngOnInit() {
    let init: boolean = true;
    this.user$ = this.store.pipe(select('user'));
    this.user$.pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
    .subscribe(user => {
      this.user = user;
      const event = this.mapEvents();
      const newEvent = event[event.length - 1];
      if (!init) {
        this.calendar.renderEvent(newEvent);
      }
      init = false;
    });
    this.initCalendar();
}

ngOnDestroy() {
  this.unsubscribe$.next();
  this.unsubscribe$.complete();
}

  private getDateString(dateUTC: number): string {
    const year = new Date(dateUTC).getFullYear();
    let month = new Date(dateUTC).getMonth();
    month++;
    let monthValue;
    let dayValue;
    if (month < 10) {
      monthValue = '0' + String(month);
    } else {
      monthValue = String(month);
    }
    const day = new Date(dateUTC).getDate();
    if (day < 10) {
      dayValue = '0' + String(day);
    } else {
      dayValue = String(day);
    }
    return `${year}-${monthValue}-${dayValue}`;
  }

  private initCalendar(): void {
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
      events: this.mapEvents(),
      eventClick: event => {
        console.log(event); // тут будем переходить на ивент по клику
      }
      // [
      //  {
      //    title: 'All Day Event',
      //    start: '2019-09-01'
      //  },
      //  {
      //    title: 'Long Event',
      //    start: '2019-09-07',
      //    end: '2019-09-10'
      //  },
      //  {
      //    id: 999,
      //   title: 'Repeating Event',
      //    start: '2019-09-09T16:00:00'
      //  },
      //  {
      //    id: 999,
      //   title: 'Repeating Event',
      //    start: '2019-09-16T16:00:00'
      //  },
      //  {
      //    title: 'Conference',
      //    start: '2019-09-11',
      //    end: '2019-09-13'
      //  },
      //  {
      //    title: 'Meeting',
      //    start: '2019-09-12T10:30:00',
      //   end: '2019-09-12T12:30:00'
      //  },
      //  {
      //    title: 'Lunch',
      //    start: '2019-09-12T12:00:00'
      //  },
      //  {
      //    title: 'Meeting',
      //    start: '2019-09-12T14:30:00'
      //  },
      //  {
      //    title: 'Happy Hour',
      //    start: '2019-09-12T17:30:00'
      //  },
      //  {
      //    title: 'Dinner',
      //    start: '2019-09-12T20:00:00'
      //  },
      //  {
      //    title: 'Birthday Party',
      //    start: '2019-09-13T07:00:00'
      //  },
      //  {
      //    title: 'Click for Google',
      //    url: 'http://google.com/',
      //    start: '2019-09-28'
      //  }
    // ]
    };
  }

  private getDateStringWithTime(dateUTC: number): string {
    const date: string = this.getDateString(dateUTC);
    const hours: number = new Date(dateUTC).getHours();
    const minutes: number = new Date(dateUTC).getMinutes();
    let hourValue: string;
    let minutesValue: string;
    if (hours < 10) {
      hourValue = '0' + String(hours);
    } else {
      hourValue = String(hours);
    }
    if (minutes < 10) {
      minutesValue = '0' + String(minutes);
    } else {
      minutesValue = String(minutes);
    }
    return `${date}T${hourValue}:${minutesValue}:00`;
  }

  private mapEvents(): {id: string; title: string; start: string; end?: string}[] {
    const events = this.user.events.map(event => {
      if (event.date_type === types.dateTypeEvent.DIAPASON_OF_DATES) {
        return {
          id: event._id,
          title: event.name,
          start: this.getDateString(event.date.startDate),
          end: this.getDateString(event.date.endDate)
        };
      } else if (event.date_type === types.dateTypeEvent.EXACT_DATE) {
        return {
          id: event._id,
          title: event.name,
          start: this.getDateString(event.date.startDate)
        };
      } else if (event.date_type === types.dateTypeEvent.DIAPASON_OF_DATES_WITH_TIME) {
        return {
          id: event._id,
          title: event.name,
          start: this.getDateStringWithTime(event.date.startDate),
          end: this.getDateStringWithTime(event.date.endDate)
        };
      } else if (event.date_type === types.dateTypeEvent.EXACT_DATE_WITH_TIME) {
        return {
          id: event._id,
          title: event.name,
          start: this.getDateStringWithTime(event.date.startDate)
        };
      }
    });
    return events;
  }

}
