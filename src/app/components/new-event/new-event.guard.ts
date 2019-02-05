import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate, NavigationCancel, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NewEventComponent } from './new-event.component';

@Injectable({
  providedIn: 'root'
})

export class NewEventGuard implements CanDeactivate<NewEventComponent> {

  constructor () {

  }

  canDeactivate(component: NewEventComponent): Observable<boolean> | boolean {
      if (component.openConfrimPopup) {
        return component.eventLeavePopup.onOpen();
      } else {
      return true;
    }
  }
}
