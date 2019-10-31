import { Injectable } from '@angular/core';
import { DataService } from '../services/data.service';
import { Observable, of } from 'rxjs';
import { types } from '../types/types';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class GetDataUserResolverService implements Resolve<types.User> {

  constructor(private dataService: DataService) { }

  public resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<types.User> {
    return this.dataService.getUser()
    .pipe(catchError(error => {
      return of(null);
    }));

  }
}
