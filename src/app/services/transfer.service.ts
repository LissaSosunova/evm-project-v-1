import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  public dataObj$: Observable<any>;
  private _dataObj$: Subject<any>  = new Subject<any>();
  private objData: {any} = {} as {any};

  constructor() {
    this.dataObj$ = this._dataObj$.asObservable();
  }

  // методы для передачи данных с родительского компонента в дочерний

  public dataDelete(name: string): void {
    delete this.objData[name];
  }

  public dataGet(name: string) {
    return this.objData[name];
  }

  public dataSet (param: {name: string, data: any}): void {
    this.objData[param.name] = param.data;
  }


  // методы для передачи данных с дочернего компонента в родительский

  public clearDataObs(): void {
    this._dataObj$.next('');
  }

  public setDataObs(data: any): void {
    this._dataObj$.next(data);
  }

}
