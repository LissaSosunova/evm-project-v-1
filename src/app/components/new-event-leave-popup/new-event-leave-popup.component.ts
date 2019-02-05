import { Component, OnInit } from '@angular/core';
import { PopupControls, PopupControlsService } from 'src/app/services/popup-controls.service';
import { types } from 'src/app/types/types';
import { Observable, Subject } from 'rxjs';
import { RouterService } from 'src/app/services/router.service';
import { Router, ActivatedRoute, NavigationCancel, GuardsCheckEnd, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-new-event-leave-popup',
  templateUrl: './new-event-leave-popup.component.html',
  styleUrls: ['./new-event-leave-popup.component.scss']
})
export class NewEventLeavePopupComponent implements OnInit {

  public actionSubject: Subject<boolean> = new Subject<boolean>();
  public popup: PopupControls;
  public popupConfig: types.FormPopupConfig;

  constructor(private popupControlsService: PopupControlsService,
            private routerService: RouterService,
            private router: Router,
            private route: ActivatedRoute) { }

  ngOnInit() {
    this.popup = this.popupControlsService.create(true);
    this.popupConfig = {
      header: 'Confirm action',
      isHeaderCloseBtn: true,
      isFooter: true,
      isHeader: true,
      footer: {
        isCloseBtn: true,
        submitBtnText: 'OK'
      }
    };
    this.actionSubject.next(false);
  }

  public onClose (): void {
    if (this.popup) {
      this.popup.close();
      this.actionSubject.next(false);
    }
  }

  public onOpen(): Observable<boolean> {
    if (this.popup) {
      this.popup.open();
    }
    return new Observable(observer => {
      this.actionSubject.asObservable()
        .subscribe(isConfirmed => {
          observer.next(isConfirmed);
        }
      );
    });
  }

  public onSubmit(): void  {
    this.actionSubject.next(true);
  }

}
