import { Injectable } from '@angular/core';
import { DataService } from '../services/data.service';
import { TransferService} from '../services/transfer.service';
import { Observable } from 'rxjs';
import { types } from '../types/types';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class GetDraftMessagesResolverService implements Resolve<types.DraftMessage> {

  constructor(private dataService: DataService,
              private transferService: TransferService) { }

  public resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<types.DraftMessage> {
    const chatId = route.params.chatId;
    const userData: types.User = this.transferService.dataGet('userData');
    return this.dataService.getDraftMessage(userData.username, chatId);
  }
}
