import { Injectable } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { types } from '../types/types';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GetChatResolverService implements Resolve<types.ChatData> {

  constructor(private dataService: DataService) { }

  public resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<types.ChatData> {
    const chatId = route.params.chatId;
    return this.dataService.getPrivatChat(chatId, '0');
  }
}
