export interface CookieOptions {
    expires?: string;
    path?: string;
    signed?: boolean;
    domain?: string;
    'max-age'?: number;
    secure?: null;
    samesite?:  boolean | 'lax' | 'strict' | 'none';
    httpOnly?: boolean;
    encode?: (val: string) => string;
}
