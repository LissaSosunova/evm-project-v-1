import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { types } from '../../../types/types';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { MainApiService } from '../services/main.api.service';

@Injectable()
export class GetDataUserResolverService implements Resolve<types.User> {

  constructor(private mainApiService: MainApiService) { }

  public resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<types.User> {
    return this.mainApiService.getRequest('/user/get_user')
    .pipe(catchError(error => {
      return of(null);
    }));

  }
}
