import {AbstractControl, ValidatorFn} from '@angular/forms';
import {Scope} from '../constants/scope.enum';
import {Type} from '../constants/type.enum';
import {IConventionError} from '../models/convention-error';
import {validateStructureNamingConvention, validConvention} from './naming-functions';

export function validateConvention(scope: Scope, type: Type, documentType: Type, admin: boolean): ValidatorFn {
  return (control: AbstractControl) => {
     const validation: IConventionError = validConvention(scope, type, control.value, documentType, admin);
     return validation.valid ? null : {invalidConvention: validation.error};
  };
}

export function validateStructureConvention(): ValidatorFn {
  return (control: AbstractControl) => {
     const validation: IConventionError = validateStructureNamingConvention(control.value);
     return validation.valid ? null : {invalidConvention: validation.error};
  };
}
