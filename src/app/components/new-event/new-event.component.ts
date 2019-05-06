import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NewEventLeavePopupComponent } from '../new-event-leave-popup/new-event-leave-popup.component';
import { types } from 'src/app/types/types';
import { Observable, Subject } from 'rxjs';
import { ToastService } from 'src/app/shared/toasts/services/toast.service';
import { TransferService } from 'src/app/services/transfer.service';
import { CheckboxDropdownOption } from 'src/app/shared/types/checkbox-dropdow';
import { NgForm } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { DateTransformService } from '../../services/date-transform.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss']
})
export class NewEventComponent implements OnInit, OnDestroy {
  public openConfrimPopup: boolean = true; // сейчас true для демонстрации, потом будет по умолчанию false
  // если пользователь что-то поменял в форме создания ивента, тогда ставим true
  // При сохранении ивента в случае успешного ответа от сервера ставим false
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
  public contactsForDropDown: CheckboxDropdownOption[];
  public hours: {label: string, value: number}[] = [
    {label: '0', value: 0},
    {label: '1', value: 1},
    {label: '2', value: 2},
    {label: '3', value: 3},
    {label: '4', value: 4},
    {label: '5', value: 5},
    {label: '6', value: 6},
    {label: '7', value: 7},
    {label: '8', value: 8},
    {label: '9', value: 9},
    {label: '10', value: 10},
    {label: '11', value: 11},
    {label: '12', value: 12},
    {label: '13', value: 13},
    {label: '14', value: 14},
    {label: '15', value: 15},
    {label: '16', value: 16},
    {label: '17', value: 17},
    {label: '18', value: 18},
    {label: '19', value: 19},
    {label: '20', value: 20},
    {label: '21', value: 21},
    {label: '22', value: 22},
    {label: '23', value: 23}
  ];
  public minutes: {label: string, value: number}[] = [
    {label: '00', value: 0},
    {label: '15', value: 15},
    {label: '30', value: 30},
    {label: '45', value: 45}
  ];
  @ViewChild('eventLeavePopup') public eventLeavePopup: NewEventLeavePopupComponent;

  @ViewChild('eventForm') private eventForm: NgForm;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private toastService: ToastService,
              private transferService: TransferService,
              private dateTransformService: DateTransformService,
              private dataService: DataService) { }

  ngOnInit() {
    this.user = this.transferService.dataGet('userData');
    this.eventForm.valueChanges
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(form => {
            // console.log(this.eventForm);
          });
    this.contactsForDropDown = this.user.contacts.map(contact => {
      return {
        id: contact.id,
        text: contact.name,
        isChecked: false
      };
    });
    this.initEventModel();
  }

  ngOnDestroy () {
    this.eventLeavePopup.onClose();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public saveEvent(): void {
    this.eventToDb = {
      name: this.event.name,
      status: this.event.status,
      date_type: this.event.dateType,
      place: this.event.place,
      members: this.event.members,
      additional: this.event.additional,
      date: this.dateToUTC(this.event.date)
    };
    this.dataService.saveEvent(this.eventToDb).subscribe(response => {
      if (response.status === 200) {
        this.toastService.openToastSuccess('New event was successfully saved');
      } else {
        this.toastService.openToastFail('Server error');
      }
    });
  }

  public selectedContacts(selected: CheckboxDropdownOption[]): void {
    const selectedUserIds: string[] = selected.map(user => {
      return user.id;
    });
    this.event.members.invited = selectedUserIds;
  }

  public selectDateOption(): void {
    this.event.date = {} as types.eventDate;
  }

  private dateToUTC(date: types.eventDate): types.EventDateDb {
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
    this.event.dateType = types.dateTypeEvent.DIAPASON_OF_DATES;
    this.event.date = {} as types.eventDate;
    this.event.place = {} as types.eventPlace;
    this.event.members = {} as types.eventMembers;
    this.event.status = false;
    this.dateTypesForTemplate = types.dateTypeEvent;
  }

}
