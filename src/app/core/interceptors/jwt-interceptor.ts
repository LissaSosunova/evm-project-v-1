import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MainApiService } from 'src/app/modules/main/services/main.api.service';
import { SessionStorageService } from 'src/app/services/session.storage.service';
import { types } from 'src/app/types/types';
import { CookieService } from '../services/cookie.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService,
              private mainApiService: MainApiService,
              private sessionStorageService: SessionStorageService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const access_token_valid = this.cookieService.getCookie('access_token_valid');
    if (!access_token_valid && request && !request.url.includes('/login') && !request.url.includes('registration') && !request.url.includes('refresh_token')) {
      return this.mainApiService.getRequest('/user/refresh_token').pipe(switchMap((response: types.LoginResp) => {
        this.cookieService.setCookie('access_token_valid', 'true', {'max-age': response.expires_in});
        this.sessionStorageService.setValue('true', 'session');
        return next.handle(request);
      })
      );
    }
    return next.handle(request);
  }
}
