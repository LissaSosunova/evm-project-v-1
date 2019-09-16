import { Component, OnInit, Input } from '@angular/core';
import { types } from 'src/app/types/types';
import { PopupControls, PopupControlsService } from 'src/app/services/popup-controls.service';

@Component({
  selector: 'app-user-info-popup',
  templateUrl: './user-info-popup.component.html',
  styleUrls: ['./user-info-popup.component.scss']
})
export class UserInfoPopupComponent implements OnInit {

  public popup: PopupControls;
  public popupConfig: types.FormPopupConfig;
  @Input() public userInfo: types.Contact;

  constructor(private popupControlsService: PopupControlsService) { }

  ngOnInit() {
    this.popup = this.popupControlsService.create(true);
    this.popupConfig = {
      header: 'User info',
      isHeaderCloseBtn: true,
      isFooter: true,
      isHeader: true,
      footer: {
        isCloseBtn: true
      }
    };
  }

  public open(): void {
    if (this.popup) {
      this.popup.open();
    }

  }

  public onClose (): void {
    if (this.popup) {
      this.popup.close();
    }
  }

}
