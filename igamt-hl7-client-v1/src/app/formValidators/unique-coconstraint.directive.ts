import {Directive, Input} from '@angular/core';
import {AbstractControl, FormGroup, NG_VALIDATORS, NgForm, ValidationErrors, Validator, ValidatorFn, Validators} from '@angular/forms';

@Directive({
  selector: '[appUniqueSelectorCC]',
  providers: [{provide: NG_VALIDATORS, useExisting: UniqueCoConstraintDirective, multi: true}]
})
export class UniqueCoConstraintDirective implements Validator {

  @Input('appUniqueSelectorCC')
  enabled: boolean;
  @Input('uniqueSelectorCCColumn')
  column: string;
  @Input('uniqueSelectorCCField')
  field: string;
  @Input('uniqueSelectorCCForm')
  form: NgForm;
  @Input('uniqueSelectorCCId')
  current: string;

  constructor() {}

  validate(control: AbstractControl): { [key: string]: any } {
    if (control.value && control.value !== '' && this.enabled) {
      return this.found(this.form, control.value, this.column, this.field, this.current) ? {unique: 'This field must be unique'} : null;
    } else {
      return null;
    }
  }


  //
  found(form: NgForm, value: string, field: string, key: string, exclude: string) {
    for (const control in form.controls) {
      if (control.includes(key) && control.includes(field) && form.controls[control].value === value && control !== exclude) {
        return true;
      }
    }
    return false;
  }


}
