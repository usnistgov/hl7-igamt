import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {Scope} from '../constants/scope.enum';
import {Type} from '../constants/type.enum';
import {validConvention} from '../functions/naming-functions';
import {IConventionError} from '../models/convention-error';

@Directive({
  selector: '[appNamingConvention]',
  providers: [{provide: NG_VALIDATORS, useExisting: NamingConventionDirective, multi: true}],
})
export class NamingConventionDirective  implements Validator {
  @Input()
  scope: Scope;
  @Input()
  Type: Type;

  constructor() {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const validation: IConventionError = validConvention(this.scope, this.Type, control.value);
    return validation.valid ? null : {invalidConvention: validation.error};
  }
}
