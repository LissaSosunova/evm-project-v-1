import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { types } from '../../../types/types';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { MainApiService } from '../services/main.api.service';

@Injectable()
export class GetChatResolverService implements Resolve<types.PrivateChat | types.Message[]> {

  constructor(private mainApiService: MainApiService) { }

  public resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<types.PrivateChat | types.Message[]> {
    const chatId = route.params.chatId;
    const data = {
      queryNum: `0`,
      queryMessagesAmount: String(types.Defaults.QUERY_MESSAGES_AMOUNT),
      messagesShift: `0`
    };
    return this.mainApiService.getRequest(`/chat/private_chat/${chatId}`, data)
    .pipe(catchError(error => {
      return of(null);
    }));
  }
}
