import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/base-api/base-api';

@Injectable()
export class RegistrationApiService extends BaseApi {

  constructor(protected http: HttpClient) { 
    super(http)
  }

  public postRequest(url: string, body: {}, headers?: HttpHeaders): Observable<any> {
    return super.post(url, body, headers);
  }
}
