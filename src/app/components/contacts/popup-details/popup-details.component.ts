import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter
      } from '@angular/core';
import { types } from 'src/app/types/types';
import {
  PopupControls,
  PopupControlsService
      } from 'src/app/services/popup-controls.service';

@Component({
  selector: 'app-popup-details',
  templateUrl: './popup-details.component.html',
  styleUrls: ['./popup-details.component.scss']
})
export class PopupDetailsComponent implements OnInit {
  public popup: PopupControls;
  public popupConfig: types.FormPopupConfig;
  public deleteChat: boolean;
  @Input() public actionName: string;
  @Output() public submit: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private popupControlsService: PopupControlsService
  ) { }

  ngOnInit() {
    this.popup = this.popupControlsService.create(true);
      this.popupConfig = {
        header: 'Confirm action',
        isHeaderCloseBtn: true,
        isFooter: true,
        isHeader: true,
        footer: {
          isCloseBtn: true,
          isSubmitBtn: true
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

  public onSubmit(): void {
    this.submit.emit(this.deleteChat);
  }
}
