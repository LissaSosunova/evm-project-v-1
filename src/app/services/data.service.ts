import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { types } from '../types/types';
import { SessionStorageService } from './session.storage.service';

const URL_BACK = types.getURI();

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient,
            private sessionStorageService: SessionStorageService) { }

  public addUser(query: types.AddUser): Observable<any> {
    return this.http.post(URL_BACK + '/add_user/', query, {headers: this.getHeaders()});
  }

  public confUser(query: types.AddUser): Observable<any> {
    return this.http.post(URL_BACK + '/confirm_user/', query, {headers: this.getHeaders()});
  }

  public createNewPrivateChat(params: types.CreateNewChat): Observable<any> {
    return this.http.post(URL_BACK + '/new_private_chat/', params, {headers: this.getHeaders()});
  }

  public findUser(query: types.FindUser): Observable<any> {
    return this.http.post(URL_BACK + '/find_user/', query, {headers: this.getHeaders()});
  }

  public getPrivatChat(params: string, n: string): Observable<any> {
    const query = {queryNum: n};
    return this.http.get(`${URL_BACK}/private_chat/${params}`, {headers : this.getHeaders(),  params: query});
  }

  public getUser(): Observable<any> {
    return this.http.get(URL_BACK + '/user/', {headers: this.getHeaders()});
  }

  public setAuth(params: types.Login): Observable<any> {
    return this.http.post(URL_BACK + '/login/', params);
  }

  public setReg(params: types.Registration): Observable<any> {
    return this.http.post(URL_BACK + '/user/', params,  {responseType: 'text'});
  }

  public saveEvent(event: types.EventDb): Observable<any> {
    return this.http.post(URL_BACK + '/new_event/', event, {headers: this.getHeaders()});
  }

  public sendDraftMessage(query: types.DraftMessage): Observable<any> {
    return this.http.post(URL_BACK + '/set_draft_message', query, {headers: this.getHeaders()});
  }

  public sendMessage(query: types.Message): Observable<any> {
    return this.http.post(URL_BACK + '/send_message', query, {headers: this.getHeaders()});
  }

  public deleteDraftMessage(query: types.DraftMessageDeleteObj): Observable<any> {
    return this.http.post(URL_BACK + '/delete_draft_message', query, {headers: this.getHeaders()});
  }

  public getDraftMessage(userId: string, chatId: string): Observable<any> {
    const query = {authorId: userId};
    return this.http.get(`${URL_BACK}/get_draft_message/${chatId}`, {headers: this.getHeaders(), params: query});
  }

  private getHeaders(): HttpHeaders {
    const token = this.sessionStorageService.getValue('_token');
    const tokenKey = this.sessionStorageService.getValue('token_key');
    const headers = new HttpHeaders({'authorization': token, 'token_key': tokenKey});
    return headers;
  }

}
