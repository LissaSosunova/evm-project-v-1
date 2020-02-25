import { Component, NgZone, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-input-date-and-time-picker',
  templateUrl: './input-date-and-time-picker.component.html',
  styleUrls: ['./input-date-and-time-picker.component.css']
})
export class InputDateAndTimePickerComponent implements OnInit {

  @ViewChild('picker') picker: any;

  public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public disableSecond = true;
  @Input() public placeholder?: string;

  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required])
  })
  public dateControl = new FormControl(moment());

  constructor(private zone: NgZone) {
  }

  ngOnInit() {
    this.date = null;
  }

  closePicker(){
    this.picker.cancel();
  }

}
