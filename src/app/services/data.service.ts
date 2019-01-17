import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { types } from '../types/types';

const URL_BACK = types.getURI();

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient) { }

  public setAuth(params: types.Login): Observable<any> {
   return this.http.post(URL_BACK + '/login/', params);
  }
  public setReg(params: types.Registration): Observable<any> {
    return this.http.post(URL_BACK + '/user/', params,  {responseType: 'text'});
  }
  public getUser(): Observable<any> {
    const token = sessionStorage.getItem('_token');
    const headers = new HttpHeaders({'authorization': token});
    return this.http.get(URL_BACK + '/user/', {headers});
  }
  public findUser(query: types.FindUser): Observable<any> {
    console.log(typeof query.query);
    const token = sessionStorage.getItem('_token');
    const headers = new HttpHeaders({'authorization': token});
    return this.http.post(URL_BACK + '/finduser/', query.query, {headers});
  }
  public addUser(query: types.AddUser): Observable<any> {
    console.log(typeof query.query);
    const token = sessionStorage.getItem('_token');
    const headers = new HttpHeaders({'authorization': token});
    return this.http.post(URL_BACK + '/adduser/', query.query, {headers});
  }
  public confUser(query: types.AddUser): Observable<any> {
    console.log(typeof query.query);
    const token = sessionStorage.getItem('_token');
    const headers = new HttpHeaders({'authorization': token});
    return this.http.post(URL_BACK + '/confirmuser/', query.query, {headers});
  }
}
