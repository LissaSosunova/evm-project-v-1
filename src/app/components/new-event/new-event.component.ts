import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NewEventLeavePopupComponent } from './new-event-leave-popup/new-event-leave-popup.component';
import { types } from 'src/app/types/types';
import { Subject, Observable } from 'rxjs';
import { ToastService } from 'src/app/shared/toasts/services/toast.service';
import { TransferService } from 'src/app/services/transfer.service';
import { CheckboxDropdownOption } from 'src/app/shared/types/checkbox-dropdow';
import { NgForm } from '@angular/forms';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { DateTransformService } from '../../services/date-transform.service';
import { DataService } from '../../services/data.service';
import { SocketIoService } from 'src/app/services/socket.io.service';
import { SocketIO } from 'src/app/types/socket.io.types';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss']
})
export class NewEventComponent implements OnInit, OnDestroy {
  public openConfirmPopup = false;
  public user: types.User;
  public event: types.EventUI;
  public eventToDb: types.EventDb;
  public dateTypes: types.dateTypeEvent[] = [
    types.dateTypeEvent.DIAPASON_OF_DATES,
    types.dateTypeEvent.DIAPASON_OF_DATES_WITH_TIME,
    types.dateTypeEvent.EXACT_DATE,
    types.dateTypeEvent.EXACT_DATE_WITH_TIME
  ];
  public dateTypesForTemplate: typeof types.dateTypeEvent;
  public contactsForDropDown: CheckboxDropdownOption<{avatar: string}>[];
  public hours: {label: string, value: number}[] = [];
  public minutes: {label: string, value: number}[] = [
    {label: '00', value: 0},
    {label: '15', value: 15},
    {label: '30', value: 30},
    {label: '45', value: 45}
  ];
  @ViewChild('eventLeavePopup', {static: true}) public eventLeavePopup: NewEventLeavePopupComponent;

  @ViewChild('eventForm', {static: true}) private eventForm: NgForm;

  private user$: Observable<types.User>;
  private unsubscribe$: Subject<void> = new Subject();

  constructor(private toastService: ToastService,
              private transferService: TransferService,
              private dateTransformService: DateTransformService,
              private socketIOService: SocketIoService,
              private dataService: DataService,
              private store: Store<types.User>,
              private router: Router) { }

  ngOnInit() {
    this.user$ = this.store.pipe(select('user'));
    this.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;
      this.contactsForDropDown = this.user.contacts.map(contact => {
        return {
          id: contact.id,
          text: contact.name,
          isChecked: false,
          options: {
            avatar: contact.avatar.url
          }
        };
      });
    });
    this.eventForm.valueChanges
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(form => {
            this.openConfirmPopup = Object.keys(form).some(key => !!form[key]);
          });
    this.initEventModel();
    this.initNewEventConfirm();
  }

  ngOnDestroy () {
    this.eventLeavePopup.onClose();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public saveEvent(): void {
    this.eventToDb = {
      name: this.event.name,
      status: !!this.event.status,
      date_type: this.event.dateType,
      place: this.event.place,
      members: this.event.members,
      additional: this.event.additional,
      date: this.dateToUTC(this.event.date),
      authorId: this.user.username
    };
    this.socketIOService.socketEmit(SocketIO.events.new_event, this.eventToDb);
  }

  public selectedContacts(selected: CheckboxDropdownOption<{avatar: string}>[]): void {
    const selectedUserIds: string[] = selected.map(user => {
      return user.id;
    });
    this.event.members.invited = selectedUserIds;
    this.openConfirmPopup = true;
  }

  public selectDateOption(): void {
    this.event.date = {} as types.EventDate;
  }

  private dateToUTC(date: types.EventDate): types.EventDateDb {
    const UTCdate: types.EventDateDb = {} as types.EventDateDb;
    if (this.event.dateType === types.dateTypeEvent.EXACT_DATE) {
      UTCdate.startDate = this.dateTransformService.dateToUtc(date.startDate);
    } else if (this.event.dateType === types.dateTypeEvent.EXACT_DATE_WITH_TIME) {
      UTCdate.startDate = this.dateTransformService.dateToUtcWithTime(date.startDate, date.startHours, date.startMinutes, 0, 0);
    } else if (this.event.dateType === types.dateTypeEvent.DIAPASON_OF_DATES) {
      UTCdate.startDate = this.dateTransformService.dateToUtc(date.startDate);
      UTCdate.endDate = this.dateTransformService.dateToUtc(date.endDate);
    } else if (this.event.dateType === types.dateTypeEvent.DIAPASON_OF_DATES_WITH_TIME) {
      UTCdate.startDate = this.dateTransformService.dateToUtcWithTime(date.startDate, date.startHours, date.startMinutes, 0, 0);
      UTCdate.endDate = this.dateTransformService.dateToUtcWithTime(date.endDate, date.endHours, date.endMinutes, 0, 0);
    }
    return UTCdate;
  }

  private initEventModel(): void {
    this.event = {} as types.EventUI;
    this.event.date = {} as types.EventDate;
    this.event.place = {} as types.EventPlace;
    this.event.members = {} as types.EventMembers;
    this.dateTypesForTemplate = types.dateTypeEvent;
    for (let i = 0; i <= 23; i++) {
      const obj: {label: string, value: number} = {
        label: String(i),
        value: i
      };
      this.hours.push(obj);
    }
  }

  private initNewEventConfirm(): void {
    this.socketIOService.on(SocketIO.events.new_event_confirm).pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
    .subscribe((response: {message: string, eventId: string}) => {
      this.toastService.openToastSuccess('New event was successfully saved');
      this.openConfirmPopup = false;
      this.user.events.push(this.eventToDb);
      this.transferService.dataSet({name: 'userData', data: this.user});
      this.eventToDb._id = response.eventId;
      setTimeout(() => {
        this.router.navigate(['/main/events']);
      }, 2000);
    },
    err => {
      this.toastService.openToastFail('Server error');
    });
  }

}
