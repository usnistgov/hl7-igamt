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
  type: Type;

  constructor() {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    console.log(this.scope);
    console.log(this.type);
    const validation: IConventionError = validConvention(this.scope, this.type, control.value);
    return validation.valid ? null : {invalidConvention: validation.error};
  }
}
