export function cookiesToObject(cookies: string) {
    if (!cookies) {
        return;
    }
    return Object.fromEntries(cookies.split(';').map(item => item.trim().split('=')));
}
