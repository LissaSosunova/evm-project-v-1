import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastService } from 'src/app/modules/shared/toasts/services/toast.service';
import { CookieService } from '../services/cookie.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private toastService: ToastService,
              private cookieService: CookieService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const sign_in = this.cookieService.getCookie('sign_in');
    if (!sign_in && request && !request.url.includes('/login') && !request.url.includes('registration')) {
      this.router.navigate(['/login']);
      this.toastService.openToastWarning('Your session was expired. Please sign in again', {duration: 7000});
      return;
    }
    return next.handle(request);
  }
}
