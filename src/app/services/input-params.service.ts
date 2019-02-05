import { Injectable } from '@angular/core';
import { InputParams } from '../types/input-params';

@Injectable({
  providedIn: 'root'
})
export class InputParamsService {

  constructor() { }

  private inputs: { [inputId: string]: InputParams } = {};

  public add(inputParams: InputParams, inputId: string): void {
    this.inputs[inputId] = inputParams;
  }

  public remove(inputId: string): void {
    delete this.inputs[inputId];
  }

  public get(inputId: string): InputParams {
    return this.inputs[inputId];
  }
}
