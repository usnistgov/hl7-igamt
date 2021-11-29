import {Directive, Input} from '@angular/core';
import {AbstractControl, FormGroup, NG_VALIDATORS, NgForm, ValidationErrors, Validator, ValidatorFn, Validators} from '@angular/forms';

@Directive({
  selector: '[appMinCardinality]',
  providers: [{provide: NG_VALIDATORS, useExisting: MinCardinalityDirective, multi: true}]
})
export class MinCardinalityDirective implements Validator {

  @Input('appMinCardinality')
  max: string;
  constructor() {}

  validate(control: AbstractControl): { [key: string]: any } {
    if (control && control.value && this.max && this.max !== '*' && control.value > this.max) {
      return { edge : ''};
    } else {
      return null;
    }
  }
}
