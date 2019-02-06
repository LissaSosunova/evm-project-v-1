import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NewEventLeavePopupComponent } from '../new-event-leave-popup/new-event-leave-popup.component';
import { types } from 'src/app/types/types';
import { Observable } from 'rxjs';


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

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy () {
    this.eventLeavePopup.onClose();
  }

}
