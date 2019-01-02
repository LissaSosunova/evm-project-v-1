import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { types } from '../types/types';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class GetDataUserResolverService implements Resolve<types.User> {

  constructor(private dataService: DataService) { }

  public resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<types.User> {
    return this.dataService.getUser();
  }
}
