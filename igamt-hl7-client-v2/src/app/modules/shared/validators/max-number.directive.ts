import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appMaxNumber][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MaxNumberDirective, multi: true },
  ],
})
export class MaxNumberDirective implements Validator {

  @Input()
  appMaxNumber: number;

  constructor() { }

  validate(control: AbstractControl): ValidationErrors {
    if (control.value > this.appMaxNumber) {
      return {
        max: {
          limit: this.appMaxNumber,
          actual: control.value,
        },
      };
    } else {
      return null;
    }
  }
}
