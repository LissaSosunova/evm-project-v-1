interface CookieOptions {
    expires?: string;
    path?: string;
    signed?: boolean;
    domain?: string;
    'max-age'?: number;
    secure?: null;
    samesite?: 'strict' | 'lax';
    httpOnly?: null;
}


export function setCookie(name: string, value: string, $document: Document, options: CookieOptions = {}): void {
    let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    // tslint:disable-next-line: forin
    for (const optionKey in options) {
      updatedCookie += '; ' + optionKey;
      const optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += '=' + optionValue;
      }
    }

    $document.cookie = updatedCookie;
  }

export function getCookie(name: string): string | undefined {
    const matches = document.cookie.match(new RegExp(
      '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)',
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

export function deleteCookie(name: string, $document: Document): void {
    setCookie(name, '', $document, {
      'max-age': -1,
    });
}