export function cookiesToObject(cookies: string) {
    return Object.fromEntries(cookies.split(';').map(item => item.trim().split('=')));
}