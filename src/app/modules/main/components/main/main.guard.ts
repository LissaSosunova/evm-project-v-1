import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'src/app/core/services/cookie.service';
import { SessionStorageService } from 'src/app/services/session.storage.service';


@Injectable({
  providedIn: 'root'
})
export class MainGuard implements CanActivate {

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private sessionStorageServive: SessionStorageService,
) {
}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const access_token_valid = this.cookieService.getCookie('access_token_valid');
    const session = this.sessionStorageServive.getValue('session');
    if (session || access_token_valid) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
