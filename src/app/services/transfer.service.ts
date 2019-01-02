import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private dataObj = new Subject<any>();
  private objData: {any} = {} as {any};

  constructor() { }

  // методы для передачи данных с родительского компонента в дочерний

  public dataDelete(name: string): void {
    delete this.objData[name];
  }

  public dataGet(name: string): {any} {
    return this.objData[name];
  }

  public dataSet (param: {name: string, data: any}): void {
    this.objData[param.name] = param.data;
  }


  // методы для передачи данных с дочернего компонента в родительский

  public clearData(): void {
    this.dataObj.next();
  }

  public getDataObs(): Observable<any> {
    return this.dataObj.asObservable();
  }

  public setDataObs(data: any): void {
    this.dataObj.next(data);
  }

}
