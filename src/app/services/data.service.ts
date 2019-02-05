import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { types } from '../types/types';
import { TokenService } from './token.service';

const URL_BACK = types.getURI();

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient,
            private tokenService: TokenService) { }

  public setAuth(params: types.Login): Observable<any> {
   return this.http.post(URL_BACK + '/login/', params);
  }
  public setReg(params: types.Registration): Observable<any> {
    return this.http.post(URL_BACK + '/user/', params,  {responseType: 'text'});
  }
  public getUser(): Observable<any> {
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({'authorization': token});
    return this.http.get(URL_BACK + '/user/', {headers});
  }
  public findUser(query: types.FindUser): Observable<any> {
    console.log(typeof query.query);
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({'authorization': token});
    return this.http.post(URL_BACK + '/finduser/', query, {headers});
  }
  public addUser(query: types.AddUser): Observable<any> {
    console.log(typeof query.query);
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({'authorization': token});
    return this.http.post(URL_BACK + '/adduser/', query, {headers});
  }
  public confUser(query: types.AddUser): Observable<any> {
    console.log(typeof query.query);
    const token = this.tokenService.getToken();
    const headers = new HttpHeaders({'authorization': token});
    return this.http.post(URL_BACK + '/confirmuser/', query, {headers});
  }
}
