import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor() { }

  public generateId( prefix ) {
        function getRandomInt(min: number, max: number) {

            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const generatedCharsLength = 7;
        let key = `${prefix}-`;
        for (let i = 0; i < generatedCharsLength; i++) {
            key += getRandomInt(0, 9);
        }

        return key;
    }

    public getPositionOnPage (param: string) {
        let cssClass;

        switch (param) {
            // Dash case
            case 'center-top':
                cssClass = 'center-top';
                break;
            case 'center-center':
                cssClass = 'center-center';
                break;
            // Camel case
            case 'centerTop':
                cssClass = 'center-top';
                break;
            case 'centerCenter':
                cssClass = 'center-center';
                break;
            default:
                cssClass = 'center-top';
        }

        return cssClass;
    }
}
