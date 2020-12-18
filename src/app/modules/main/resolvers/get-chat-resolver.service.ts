import { Injectable } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Observable, of } from 'rxjs';
import { types } from '../../../types/types';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetChatResolverService implements Resolve<types.PrivateChat | types.Message[]> {

  constructor(private dataService: DataService) { }

  public resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<types.PrivateChat | types.Message[]> {
    const chatId = route.params.chatId;
    return this.dataService.getPrivatChat(chatId, '0', String(types.Defaults.QUERY_MESSAGES_AMOUNT), '0')
    .pipe(catchError(error => {
      return of(null);
    }));
  }
}
