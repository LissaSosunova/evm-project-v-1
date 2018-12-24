import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

const URL_BACK = 'http://localhost:5006';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient) { }

  setAuth(params) {
   return this.http.post(URL_BACK + '/login/', params);
  }
  setReg(params) {
    return this.http.post(URL_BACK + '/user/', params,  {responseType: 'text'});
  }
  getUser() {
    let token = sessionStorage.getItem('_token');
    const headers = new HttpHeaders({'authorization':token});
    return this.http.get(URL_BACK + '/user/',{headers});
  }
}
