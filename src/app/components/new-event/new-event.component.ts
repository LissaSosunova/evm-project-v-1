import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NewEventLeavePopupComponent } from '../new-event-leave-popup/new-event-leave-popup.component';
import { types } from 'src/app/types/types';
import { Observable } from 'rxjs';
import { ToastService } from 'src/app/shared/toasts/services/toast.service';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss']
})
export class NewEventComponent implements OnInit, OnDestroy {
  public openConfrimPopup: boolean = true; // сейчас true для демонстрации, потом будет по умолчанию false
  // если пользователь что-то поменял в форме создания ивента, тогда ставим true
  // При сохранении ивента в случае успешного ответа от сервера ставим false
  @ViewChild('eventLeavePopup') public eventLeavePopup: NewEventLeavePopupComponent;

  constructor(private toastService: ToastService) { }

  ngOnInit() {
  }

  ngOnDestroy () {
    this.eventLeavePopup.onClose();
  }

  public openToastSuccess(): void {
    this.toastService.openToastSuccess('Message: test success');
  }

  public openToastFail(): void {
    this.toastService.openToastFail("The test fail becuase it isn't on top");
  }

  public openToastWarning(): void {
    this.toastService.openToastWarning('Message: test warning');
  }

}
