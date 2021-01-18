import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/base-api/base-api';

@Injectable()
export class MainApiService extends BaseApi {

  constructor(protected http: HttpClient) {
    super(http);
  }

  public getRequest(url: string, params?: {}): Observable<any> {
    return super.get(url, params);
  }

  public postRequest(url: string, params: {}): Observable<any> {
    return super.post(url, params);
  }

  public putRequest(url: string, params: {}): Observable<any> {
    return super.put(url, params);
  }

  public deleteRequest(url: string): Observable<any> {
    return super.delete(url);
  }

}
