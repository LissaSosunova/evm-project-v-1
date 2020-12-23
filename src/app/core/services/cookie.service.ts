import { Injectable } from '@angular/core';
import { CookieOptions } from '../models/cookie-options';

@Injectable({
  providedIn: 'root',
})
export class CookieService {

  constructor() { }

  public setCookie(name: string, value: string, options: CookieOptions = {}): void {
    let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    // tslint:disable-next-line: forin
    for (const optionKey in options) {
      updatedCookie += '; ' + optionKey;
      const optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += '=' + optionValue;
      }
    }

    document.cookie = updatedCookie;
  }

  public getCookie(name: string): string {
    const matches = document.cookie.match(new RegExp(
      '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)',
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  public deleteCookie(name: string): void {
    this.setCookie(name, '', {
      'max-age': -1,
    });
  }
}
