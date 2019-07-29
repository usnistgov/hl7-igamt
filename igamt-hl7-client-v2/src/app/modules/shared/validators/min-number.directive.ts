import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appMinNumber][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MinNumberDirective, multi: true },
  ],
})
export class MinNumberDirective implements Validator {

  @Input()
  appMinNumber: number;

  constructor() { }

  validate(control: AbstractControl): ValidationErrors {
    if (control.value < this.appMinNumber) {
      return {
        min: {
          limit: this.appMinNumber,
          actual: control.value,
        },
      };
    } else {
      return null;
    }
  }
}
