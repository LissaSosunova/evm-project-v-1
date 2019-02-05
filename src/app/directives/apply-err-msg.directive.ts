import { Directive, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { NG_VALIDATORS, AbstractControl } from '@angular/forms';
import { InputParamsService } from '../services/input-params.service';
import { ValidatorService } from '../services/validator.service';
import { InputParams } from '../types/input-params';


@Directive({
  selector: '[appApplyErrMsg]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: ApplyErrMsgDirective, multi: true }
  ]
})

export class ApplyErrMsgDirective implements OnInit, OnDestroy {

  @Input() public type: string;
  // Custom validation params
  @Input() public min: string;
  @Input() public max: string;
  @Input() public integer: string;

  constructor(private inputParamsService: InputParamsService,
    private validator: ValidatorService,
    private elem: ElementRef) { }

    /**
   * Custom validation method
   */
  public validate(control: AbstractControl): {[key: string]: any} {

    if (this.type === 'email') {
      return this.validator.email(control.value);
    }

    if (this.type === 'number') {

      if (this.integer === '') {
          const isInvalid = this.validator.integer(control.value);
          if (isInvalid) {
            return isInvalid;
          }
      }

      const isNumber = this.validator.isNumber;

      if (isNumber(this.min) && isNumber(this.max)) {
        const isMinInvalid = this.validator.min(control.value, + this.min);
        if (isMinInvalid) {
          return isMinInvalid;
        }
        return this.validator.max(control.value, + this.max);
      }

      if (isNumber(this.min) && !isNumber(this.max)) {
        return  this.validator.min(control.value, + this.min);
      }

      if (isNumber(this.max) && !isNumber(this.min)) {
        return this.validator.max(control.value, + this.max);
      }
    }
  }

  public ngOnInit(): void {
    const inputParams = this.getParams(this.elem.nativeElement);
    this.inputParamsService.add(inputParams, this.elem.nativeElement.id);
  }

  public ngOnDestroy(): void {
    this.inputParamsService.remove(this.elem.nativeElement.id);
  }

  private getParams(elem: HTMLInputElement): InputParams {
    const params: InputParams = {
      type: elem.type,
      label: elem.getAttribute('mFloatLabel') || elem.getAttribute('label'),
      isRequired: elem.hasAttribute('required')
    };
    if (elem.hasAttribute('minlength')) {
      params.minLengthValue = elem.minLength;
    }
    if (elem.hasAttribute('maxlength')) {
      params.maxLengthValue = elem.maxLength;
    }
    if (this.min) {
      params.minValue = + this.min;
    }
    if (this.max) {
      params.maxValue = + this.max;
    }
    if (this.integer === '' && this.type === 'number') {
      params.isInteger = true;
    }
    return params;
  }


}
