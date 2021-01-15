import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/shared/toasts/services/toast.service';
import { CookieService } from '../services/cookie.service';


@Injectable({
  providedIn: 'root',
})
export class ResponseExceptionInterceptorService implements HttpInterceptor {

  constructor(private router: Router,
            private toastService: ToastService,
            private cookieService: CookieService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // error notification service
          }
        }),
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            // error notification service
            const {status} = error;
            if (status === 401) {
              this.router.navigate(['/login']);
              this.toastService.openToastFail('Please sign in', {duration: 7000});
              this.cookieService.deleteCookie('sign_in');
            }
          }
          return throwError(error);
        }));
  }
}
