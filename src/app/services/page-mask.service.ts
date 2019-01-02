import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageMaskService {

  constructor() { }

  public isOpened: boolean = false;
  private bodyElem: HTMLBodyElement = document.querySelector('body') as HTMLBodyElement;

  public open(): void {
      if (this.isOpened === false) {
          this.isOpened = true;
          this.disableBodyScroll();
      }
  }

  public close(): void {
      if (this.isOpened === true) {
          this.isOpened = false;
          this.enableBodyScroll();
      }
  }

  private enableBodyScroll(): void {
      this.bodyElem.classList.remove('m-grid_no-scroll');
  }

  private disableBodyScroll(): void {
      this.bodyElem.classList.add('m-grid_no-scroll');
  }
}
