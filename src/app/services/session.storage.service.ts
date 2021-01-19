import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  public getValue(key: string): string {
    return sessionStorage.getItem(key);
  }

  public setValue(value: string, key: string): void {
    sessionStorage.setItem(key, value);
  }

  public clearSessionStorage(): void {
    sessionStorage.clear();
  }

}
