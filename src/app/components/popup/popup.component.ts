import { Component, OnInit, Input, Output, ElementRef, DoCheck, EventEmitter } from '@angular/core';
import { types } from 'src/app/types/types';
import { PopupService } from 'src/app/services/popup.service';
import { FormPopupService } from 'src/app/services/form-popup.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit, DoCheck {

      // Optional custom configuration
      @Input() public config: types.FormPopupConfig;
      // These three settings may be passed through the config object or
      // as the separate parameters for convenience.
      // In the last case, they overwrite appropriate config params.
      @Input() public cssClass: string;
      @Input() public submitDisabled: boolean;
      @Input() public header: string;
      @Input() public formId: string;
      @Input() public formName: string;
      @Output() public onClose = new EventEmitter<void>();
      @Output() public onRemove = new EventEmitter<void>();
      @Output() public onSubmit = new EventEmitter<void>();

      // button order
      public closeBtnOrder: number = 1;
      public removeBtnOrder: number = 2;
      public submitBtnOrder: number = 3;
      public conf: types.FormPopupConfig;

      public generatedId = this.popupService.generateId('form');

      public constructor(private popupService: PopupService,
                         private el: ElementRef,
                         private formPopupService: FormPopupService) {

      }

      public ngOnInit(): void {
        this.initConf();
      }

      public ngDoCheck(): void {
          // Update isSubmitLoading and isRemoveLoading flags on changes
          this.updateLoadingFlagsOnChanges();
      }

      public submit(): void {
        if (this.submitDisabled) {
            return;
        }
        this.onSubmit.emit();
        if (!this.formName) {
          // console.error('FormPopupController.submit() failed, formName undefined');
          return;
        }
        this.formPopupService.submitForm(this.formName);
      }

      // The resulted configuration for popup rendering

      public closePopup(): void { this.onClose.emit(); }

      public closePopupByClickOutside(event: any): void {
          if (this.conf.footer.isSubmitLoading || this.conf.footer.isRemoveLoading) {

              return;
          }
          if (!event.target.closest(`#${this.generatedId}`)) {
              this.closePopup();
          }
      }

      public remove(): void { this.onRemove.emit(); }

      public refreshConf(): void {
          this.initConf();
      }

      private initConf(): void {

          if (!this.config) { this.config = {}; }

          this.conf = {
              position: this.config.position || 'top-center',
              cssClass: this.cssClass || this.config.cssClass || 'default-width',
              header: this.header || this.config.header,
              isHeaderCloseBtn: (typeof this.config.isHeaderCloseBtn !== 'undefined') ? this.config.isHeaderCloseBtn : true,
              formId: this.formId || this.config.formId,
              isFooter: (typeof this.config.isFooter !== 'undefined') ? this.config.isFooter : true,
              isHeader: (typeof this.config.isHeader !== 'undefined') ? this.config.isHeader : true,
              footer: {
                  // Default values
                  isCloseBtn: false,
                  closeBtnText: 'Cancel',
                  isSubmitBtn: true,
                  submitBtnText: 'Save',
                  isSubmitLoading: false,
                  isRemoveBtn: true,
                  removeBtnText: 'Remove',
                  isRemoveLoading: false
              }
          };

          // Overwrite footer default values with the custom settings
          if (this.config.footer) {
              for (const key in this.config.footer) {
                  if (this.config.footer.hasOwnProperty(key) && typeof this.config.footer[key] !== 'undefined') {
                      this.conf.footer[key] = this.config.footer[key];
                  }
              }
              if (this.config.footer.btnOrder) {
                this.closeBtnOrder = this.config.footer.btnOrder.indexOf('close') >= 0 ? this.config.footer.btnOrder.indexOf('close') + 1 : 3;
                this.removeBtnOrder = this.config.footer.btnOrder.indexOf('remove') >= 0 ? this.config.footer.btnOrder.indexOf('remove') + 1 : 2;
                this.submitBtnOrder = this.config.footer.btnOrder.indexOf('submit') >= 0 ? this.config.footer.btnOrder.indexOf('submit') + 1 : 1;
              }
          }
      }

      private updateLoadingFlagsOnChanges(): void {
          if (!this.config || !this.config.footer) {

              return;
          }
          if (this.config.footer.isSubmitLoading !== this.conf.footer.isSubmitLoading) {
              this.conf.footer.isSubmitLoading = this.config.footer.isSubmitLoading;
          }
          if (this.config.footer.isRemoveLoading !== this.conf.footer.isRemoveLoading) {
              this.conf.footer.isRemoveLoading = this.config.footer.isRemoveLoading;
          }
      }

}