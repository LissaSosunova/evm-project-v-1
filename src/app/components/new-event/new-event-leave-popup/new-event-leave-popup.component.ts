import { Component, OnInit } from '@angular/core';
import { PopupControls, PopupControlsService } from 'src/app/services/popup-controls.service';
import { types } from 'src/app/types/types';
import { Observable, Subject } from 'rxjs';
import { RouterService } from 'src/app/services/router.service';
import { Router, ActivatedRoute, NavigationCancel, GuardsCheckEnd, RouterStateSnapshot } from '@angular/router';
import { TransferService } from 'src/app/services/transfer.service';

@Component({
  selector: 'app-new-event-leave-popup',
  templateUrl: './new-event-leave-popup.component.html',
  styleUrls: ['./new-event-leave-popup.component.scss']
})
export class NewEventLeavePopupComponent implements OnInit {

  public popup: PopupControls;
  public popupConfig: types.FormPopupConfig;
  private actionSubject: Subject<boolean> = new Subject<boolean>();

  constructor(private popupControlsService: PopupControlsService,
            private transferService: TransferService) { }

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
    this.actionSubject.next(false);
  }

  public onClose (): void {
    if (this.popup) {
      this.popup.close();
      this.actionSubject.next(false);
      this.transferService.setDataObs({popupOpen: false});
    }
  }

  public onOpen(): Observable<boolean> {
    if (this.popup) {
      this.popup.open();
      this.transferService.setDataObs({popupOpen: true});
    }
    return new Observable(observer => {
      const sub = this.actionSubject.asObservable()
        .subscribe(isConfirmed => {
          observer.next(isConfirmed);
        }
      );
      return () => sub.unsubscribe();
    });
  }

  public onSubmit(): void  {
    this.actionSubject.next(true);
    this.transferService.setDataObs({popupOpen: false});
  }

}
