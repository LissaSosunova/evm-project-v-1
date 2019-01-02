import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormPopupService {

  constructor() { }

  private forms = {} as {[id: string]: Subject<boolean>};

  public  clear() {
    this.forms = {};
  }

  public getForm(formId) {
    return this.forms[formId];
  }

  public removeForm(formId) {
    if (this.forms[formId]) {
        delete this.forms[formId];
    }
  }

  public setForm(formId): Subject<boolean> {
    this.forms[formId] = new Subject<boolean>();
    return this.forms[formId];
  }

  public submitForm(formId) {
    if (!this.forms[formId]) {
        console.error(`${formId} not found`);
        return;
    }
    this.forms[formId].next(true);
  }
}
