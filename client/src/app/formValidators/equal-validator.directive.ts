
import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

/** A hero's name can't match the given regular expression */
export function equalValidator(obj: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {

    return obj!==control.value ? {'equal': {value: control.value}} : null;
  };
}

@Directive({
  selector: '[appForbiddenName]',
  providers: [{provide: NG_VALIDATORS, useExisting: EqualValidator, multi: true}]
})
export class EqualValidator implements Validator {
  @Input('equal') equal: string;

  validate(control: AbstractControl): {[key: string]: any} {
    return this.equal ? equalValidator(this.equal)(control)
      : null;
  }
}
