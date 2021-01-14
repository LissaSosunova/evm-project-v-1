import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export abstract class BaseApi {
  private readonly baseApiUrl: string = `
  ${environment.cors ? environment.backendURI : ''}${environment.baseApi}${environment.versionApi}`;

  protected constructor(protected http: HttpClient) {
  }

  public get(url: string, params?: {}, headers?: HttpHeaders): Observable<any> {
    if (params) {
      return this.http.get(this.getUrl(url), {headers, params});
    }
    return this.http.get(this.getUrl(url), {headers});
  }

  public post(url: string, data: any, headers?: HttpHeaders): Observable<any> {
    return this.http.post(this.getUrl(url), data, {headers});
  }

  public put(url: string, data: any, headers?: HttpHeaders): Observable<any> {
    return this.http.put(this.getUrl(url), data, {headers});
  }

  public patch(url: string, data: any, headers?: HttpHeaders): Observable<any> {
    return this.http.patch(this.getUrl(url), data, {headers});
  }

  public delete(url: string, headers?: HttpHeaders): Observable<any> {
    return this.http.delete(this.getUrl(url), {headers});
  }

  private getUrl(url: string): string {
    return this.baseApiUrl + url;
  }
}
