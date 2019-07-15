import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UserInfoPopupComponent } from './user-info-popup/user-info-popup.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('userPopup') private userPopup: UserInfoPopupComponent;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.userPopup.onClose();
  }

  public onPopupOpen(): void {
    this.userPopup.open();
  }

}
