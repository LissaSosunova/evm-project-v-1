import { Injectable } from '@angular/core';
import { types } from '../../../types/types';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MainApiService } from '../services/main.api.service';

@Injectable()
export class GetDraftMessagesResolverService implements Resolve<types.DraftMessageFromServer | null> {

  constructor(private mainApiService: MainApiService) { }

  public async resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<types.DraftMessageFromServer | null> {
    const chatId = route.params.chatId;
    const userData: types.User = await this.mainApiService.getRequest('/user/get_user').toPromise();
    return this.mainApiService.getRequest(`/chat/get_draft_message/${chatId}`, {authorId: userData.username}).toPromise()
    .catch(error => {
      return null;
    });
  }
}
