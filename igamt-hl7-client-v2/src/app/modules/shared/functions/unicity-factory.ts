import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {IDisplayElement} from '../models/display-element.interface';
import {IDomainInfo} from '../models/domain-info.interface';
import {isDuplicated} from './naming-functions';
export function validateUnity(existing: IDisplayElement[], fixedName: string, domainInfo: IDomainInfo): ValidatorFn {
    return (control: AbstractControl) => {
      return !isDuplicated(fixedName, control.value, domainInfo, existing) ? null : {duplicated:  control.value + ' is already used'};
    };
}

export function validateGeneratedFlavorsUnicity(existing: IDisplayElement[]): ValidatorFn {
  return (control: AbstractControl) => {
    return existing.filter((x) => x.flavorExt && x.flavorExt === control.value).length <= 0 ? null : {duplicated:  control.value + '  is already used'};
  };
}
