import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'src/app/core/services/cookie.service';


@Injectable({
  providedIn: 'root'
})
export class MainGuard implements CanActivate {

  constructor(
    private router: Router,
    private cookieService: CookieService,
) {
}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const sign_in = this.cookieService.getCookie('sign_in');
    if (sign_in) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
