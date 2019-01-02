import { Injectable } from '@angular/core';
import { PageMaskService } from './page-mask.service';


export class PopupControls {


  public isOpened: boolean;

  constructor(private pageMaskService: PageMaskService, private isPageMask?: boolean) {
      this.isOpened = false;
      this.isPageMask = (isPageMask === false) ? false : true;
  }

  public open(): void {
      if (this.isPageMask) {
          this.pageMaskService.open();
          this.isOpened = true;
          return;
      }

      this.isOpened = true;
  }

  public close(): void {
      if (this.isPageMask) {
          this.pageMaskService.close();
          this.isOpened = false;

          return;
      }

      this.isOpened = false;
  }
}

@Injectable({
  providedIn: 'root'
})

export class PopupControlsService {

    constructor(private pageMaskService: PageMaskService) {}

    public create(isPageMask?: boolean): PopupControls {
        return new PopupControls(this.pageMaskService, isPageMask);
    }

}