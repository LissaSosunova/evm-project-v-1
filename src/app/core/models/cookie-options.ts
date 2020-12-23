export interface CookieOptions {
    expires?: string;
    path?: string;
    signed?: boolean;
    domain?: string;
    'max-age'?: number;
    secure?: null;
    samesite?: 'strict' | 'lax';
    httpOnly?: null;
}
