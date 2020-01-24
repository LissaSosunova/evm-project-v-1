import { Injectable } from '@angular/core';
import { DataService } from '../services/data.service';
import { types } from '../types/types';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class GetDraftMessagesResolverService implements Resolve<types.DraftMessageFromServer | null> {

  constructor(private dataService: DataService) { }

  public async resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<types.DraftMessageFromServer | null> {
    const chatId = route.params.chatId;
    const userData: types.User = await this.dataService.getUser().toPromise();
    return this.dataService.getDraftMessage(userData.username, chatId).toPromise()
    .catch(error => {
      return null;
    });
  }
}
