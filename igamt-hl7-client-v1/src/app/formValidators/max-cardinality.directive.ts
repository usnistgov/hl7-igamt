import {Directive, Input} from '@angular/core';
import {AbstractControl, FormGroup, NG_VALIDATORS, NgForm, ValidationErrors, Validator, ValidatorFn, Validators} from '@angular/forms';

@Directive({
  selector: '[appMaxCardinality]',
  providers: [{provide: NG_VALIDATORS, useExisting: MaxCardinalityDirective, multi: true}]
})
export class MaxCardinalityDirective implements Validator {

  @Input('appMaxCardinality')
  min: number;
  constructor() {}

  validate(control: AbstractControl): { [key: string]: any } {
    if (control && control.value) {
      return Validators.compose([Validators.pattern(/^(\*|(0|[1-9]\d*)?)$/),
        (ctrl: AbstractControl): { [key: string]: any } => {
          if (this.min && ctrl.value !== '*' && +ctrl.value < this.min ) {
            return { edge : ''};
          }
      }])(control);
    } else {
      return null;
    }
  }
}
