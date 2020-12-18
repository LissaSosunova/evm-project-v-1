import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { IToken } from '../models/token-model';
import { CookieService } from '../services/cookie.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const access_token = this.cookieService.getCookie('access_token');
    const token_key = this.cookieService.getCookie('token_key');
    if (request && !request.url.includes('/login') && !request.url.includes('registration')) {
      request = request.clone({
        setHeaders: {
          Authorization: `${access_token}`,
          token_key
        },
      });
    } 
    // else if (!access_token && request && !request.url.includes('connect/token')) {
    //     return this.authService.getAuthTokenData().pipe(flatMap((response: IToken) => {
    //         request = request.clone({
    //             setHeaders: {
    //               Authorization: `${response.token_type} ${response.access_token}`,
    //             },
    //           });
    //         return next.handle(request);
    //     }));
    // }
    return next.handle(request);
  }
}
