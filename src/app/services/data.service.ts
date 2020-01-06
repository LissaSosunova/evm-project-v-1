import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { types } from '../types/types';
import { SessionStorageService } from './session.storage.service';
import {getURI} from '../constants/backendURI';

const URL_BACK = getURI;

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient,
            private sessionStorageService: SessionStorageService) { }

  public changeEmail(params: {username: string; newEmail: string}): Observable<types.Server200Response> {
    return this.http.post<types.Server200Response>(`${URL_BACK}/change_email`, params, {headers: this.getHeaders()});
  }

  public changePasswordAuth(params: {oldPassword: string; newPassword: string}): Observable<types.Server200Response> {
    return this.http.post<types.Server200Response>(`${URL_BACK}/change_password_auth`, params, {headers: this.getHeaders()});
  }

  public createNewPrivateChat(params: types.CreateNewChat): Observable<types.Chats> {
    return this.http.post<types.Chats>(URL_BACK + '/new_private_chat/', params, {headers: this.getHeaders()});
  }

  public findUser(query: types.FindUser): Observable<types.SearchContact[]> {
    return this.http.post<types.SearchContact[]>(URL_BACK + '/find_user/', query, {headers: this.getHeaders()});
  }

  public getPrivatChat(params: string, queryNum: string, queryMessagesAmount: string, messagesShift: string): Observable<types.PrivateChat | types.Message[]> {
    const query = {
      queryNum,
      queryMessagesAmount,
      messagesShift
    };
    return this.http.get<types.PrivateChat | types.Message[]>(`${URL_BACK}/private_chat/${params}`, {headers : this.getHeaders(),  params: query});
  }

  public getUser(): Observable<types.User> {
    return this.http.get<types.User>(URL_BACK + '/user/', {headers: this.getHeaders()});
  }

  public setAuth(params: types.Login): Observable<types.LoginServerResponse> {
    return this.http.post<types.LoginServerResponse>(URL_BACK + '/login/', params);
  }

  public setReg(params: types.Registration): Observable<types.Server200Response> {
    return this.http.post<types.Server200Response>(URL_BACK + '/user/', params);
  }

  public sendDraftMessage(query: types.DraftMessage): Observable<types.Server200Response> {
    return this.http.post<types.Server200Response>(URL_BACK + '/set_draft_message', query, {headers: this.getHeaders()});
  }

  public deleteDraftMessage(query: types.DraftMessageDeleteObj): Observable<types.Server200Response> {
    return this.http.post<types.Server200Response>(URL_BACK + '/delete_draft_message', query, {headers: this.getHeaders()});
  }

  public deleteAvatar(query: {userId: string}): Observable<{owner: string; url: string}> {
    return this.http.post<{owner: string; url: string}>(`${URL_BACK}/delete_avatar`, query, {headers: this.getHeaders()});
  }

  public getDraftMessage(userId: string, chatId: string): Observable<types.DraftMessageFromServer> {
    const query = {authorId: userId};
    return this.http.get<types.DraftMessageFromServer>(`${URL_BACK}/get_draft_message/${chatId}`, {headers: this.getHeaders(), params: query});
  }

  public uploadAvatar(obj: FormData, userId: string): Observable<types.UploadAvatarResponse> {
    return this.http.post<types.UploadAvatarResponse>(URL_BACK + '/upload_avatar', obj, {headers: this.getHeaderForUploadFile(userId)});
  }

  public forgotPassword(email: string): Observable<types.Server200Response> {
    return this.http.post<types.Server200Response>(`${URL_BACK}/forgot_password`, {email});
  }

  public changePassword(password: string, token: string, tokenTime: string): Observable<types.Server200Response> {
    const headers = new HttpHeaders({'authorization': token});
    return this.http.post<types.Server200Response>(`${URL_BACK}/change_password`, {password, tokenTime}, {headers});
  }

  public setNewProfileData(params: any): Observable<any> {
    return this.http.post(URL_BACK + '/profile', params, {headers: this.getHeaders()});
  }

  private getHeaders(): HttpHeaders {
    const token = this.sessionStorageService.getValue('_token');
    const tokenKey = this.sessionStorageService.getValue('token_key');
    const headers = new HttpHeaders({'authorization': token, 'token_key': tokenKey});
    return headers;
  }

  private getHeaderForUploadFile(userId: string): HttpHeaders {
    const token = this.sessionStorageService.getValue('_token');
    const tokenKey = this.sessionStorageService.getValue('token_key');
    const headers = new HttpHeaders({'authorization': token, 'token_key': tokenKey, 'userId': userId});
    return headers;
  }

}
