
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

export function equalValidator(obj: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {

    console.log(control);
    console.log(obj);
    return control.value == obj ? {'not match ': {value: control.value}} : null;
  };

}
