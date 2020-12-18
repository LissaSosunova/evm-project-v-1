import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { types } from '../types/types';
import { environment } from 'src/environments/environment';
import { CookieService } from '../core/services/cookie.service';

const URL_BACK: string = environment.backendURI;
const baseApi = environment.baseApi;
const versionApi = environment.versionApi;

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient,
            private cookieService: CookieService) { }

  public changeEmail(params: {username: string; newEmail: string}): Observable<types.Server200Response> {
    return this.http.put<types.Server200Response>(`${URL_BACK}${baseApi}${versionApi}/user/change_email`, params, {headers: this.getHeaders()});
  }

  public changePasswordAuth(params: {oldPassword: string; newPassword: string}): Observable<types.Server200Response> {
    return this.http.post<types.Server200Response>(`${URL_BACK}${baseApi}${versionApi}/user/change_password_auth`, params, {headers: this.getHeaders()});
  }

  public createNewPrivateChat(params: types.CreateNewChat): Observable<types.Chats> {
    return this.http.post<types.Chats>(URL_BACK + baseApi + versionApi + '/chat/new_private_chat/', params, {headers: this.getHeaders()});
  }

  public findUser(query: string): Observable<types.SearchContact[]> {
    return this.http.get<types.SearchContact[]>(URL_BACK + baseApi + versionApi + '/user/find_user/', {headers: this.getHeaders(), params: {query}});
  }

  public getPrivatChat(chatId: string,
    queryNum: string,
    queryMessagesAmount: string,
    messagesShift: string): Observable<types.PrivateChat | types.Message[]> {
    const query = {
      queryNum,
      queryMessagesAmount,
      messagesShift
    };
    return this.http.get<types.PrivateChat | types.Message[]>(`${URL_BACK}${baseApi}${versionApi}/chat/private_chat/${chatId}`,
    {headers : this.getHeaders(),  params: query});
  }

  public getUser(): Observable<types.User> {
    return this.http.get<types.User>(URL_BACK + baseApi + versionApi + '/user/get_user', {headers: this.getHeaders()});
  }

  public setAuth(params: types.Login): Observable<types.LoginServerResponse> {
    return this.http.post<types.LoginServerResponse>(URL_BACK + baseApi + versionApi + '/login/', params);
  }

  public setReg(params: types.Registration): Observable<types.Server200Response> {
    return this.http.post<types.Server200Response>(URL_BACK + baseApi + versionApi + '/registration/user/', params);
  }

  public sendDraftMessage(query: types.DraftMessage): Observable<types.Server200Response> {
    return this.http.post<types.Server200Response>(URL_BACK + baseApi + versionApi + '/chat/set_draft_message', query, {headers: this.getHeaders()});
  }

  public deleteDraftMessage(query: types.DraftMessageDeleteObj): Observable<types.Server200Response> {
    const {chatID, authorId} = query; 
    return this.http.delete<types.Server200Response>(`${URL_BACK}${baseApi}${versionApi}/chat/delete_draft_message/${chatID}/${authorId}`, {headers: this.getHeaders(), params: {chatID, authorId}});
  }

  public deleteAvatar(userId: string): Observable<{owner: string; url: string}> {
    return this.http.delete<{owner: string; url: string}>(`${URL_BACK}${baseApi}${versionApi}/user/delete_avatar/${userId}`, {headers: this.getHeaders()});
  }

  public getDraftMessage(userId: string, chatId: string): Observable<types.DraftMessageFromServer> {
    const query = {authorId: userId};
    return this.http.get<types.DraftMessageFromServer>(`${URL_BACK}${baseApi}${versionApi}/chat/get_draft_message/${chatId}`,
    {headers: this.getHeaders()});
  }

  public uploadAvatar(obj: FormData, userId: string): Observable<types.UploadAvatarResponse> {
    return this.http.post<types.UploadAvatarResponse>(URL_BACK + baseApi + versionApi + '/user/upload_avatar', obj, {headers: this.getHeaderForUploadFile(userId)});
  }

  public forgotPassword(email: string): Observable<types.Server200Response> {
    return this.http.post<types.Server200Response>(`${URL_BACK}${baseApi}${versionApi}/registration/forgot_password`, {email});
  }

  public changePassword(password: string, token: string, tokenTime: string): Observable<types.Server200Response> {
    const headers = new HttpHeaders({'authorization': token});
    return this.http.post<types.Server200Response>(`${URL_BACK}${baseApi}${versionApi}/registration/change_password`, {password, tokenTime}, {headers});
  }

  public setNewProfileData(params: any): Observable<types.User> {
    return this.http.put<types.User>(URL_BACK + baseApi + versionApi + '/user/profile', params, {headers: this.getHeaders()});
  }

  public account(): Observable<types.User> {
    return this.http.get<types.User>(`${URL_BACK}${baseApi}${versionApi}/user/account`, {headers: this.getHeaders()});
  }

  private getHeaders(): HttpHeaders {
    const token = this.cookieService.getCookie('access_token');
    const tokenKey = this.cookieService.getCookie('token_key');
    const headers = new HttpHeaders({'authorization': token, 'token_key': tokenKey});
    return headers;
  }

  private getHeaderForUploadFile(userId: string): HttpHeaders {
    const token = this.cookieService.getCookie('access_token');
    const tokenKey = this.cookieService.getCookie('token_key');
    const headers = new HttpHeaders({'authorization': token, 'token_key': tokenKey, 'userId': userId});
    return headers;
  }

}
