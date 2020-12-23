import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from 'src/app/core/services/cookie.service';
import { BaseApi } from '../../shared/base-api/base-api';

@Injectable()
export class MainApiService extends BaseApi {

  constructor(protected http: HttpClient,
    private cookieService: CookieService) {
    super(http)
  }

  public getRequest(url: string, params?: {}): Observable<any> {
    return super.get(url, params, this.getHeaders());
  }

  public postRequest(url: string, params: {}, headers?: {[name: string]: string}): Observable<any> {
    return super.post(url, params, this.getHeaders(headers));
  }

  public putRequest(url: string, params: {}): Observable<any> {
    return super.put(url, params, this.getHeaders());
  }

  public deleteRequest(url: string): Observable<any> {
    return super.delete(url, this.getHeaders());
  }

  private getHeaders(additionalHeaders?: {[name: string]: string}): HttpHeaders {
    const token = this.cookieService.getCookie('access_token');
    const tokenKey = this.cookieService.getCookie('token_key');
    const headers = new HttpHeaders({'authorization': token, 'token_key': tokenKey, ... additionalHeaders});
    return headers;
  }
}
