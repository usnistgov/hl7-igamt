import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { IDisplayElement } from '../models/display-element.interface';
import { IDomainInfo } from '../models/domain-info.interface';
import { IAddingInfo } from './../models/adding-info';
import { isAdded, isDuplicated, isDuplicatedLabelStructure } from './naming-functions';

const DUPLICATION_MESSAGE = ' is already used';

export function validateUnity(existing: IDisplayElement[], fixedName: string, domainInfo: IDomainInfo): ValidatorFn {
  return (control: AbstractControl) => {
    return !isDuplicated(fixedName, control.value, domainInfo, existing) ? null : { duplicated: control.value + DUPLICATION_MESSAGE };
  };
}

export function validateStructureUnicity(existing: IDisplayElement[], fixedName: string, domainInfo: IDomainInfo): ValidatorFn {
  return (control: AbstractControl) => {
    return !isDuplicatedLabelStructure(fixedName, control.value, domainInfo, existing) ? null : { duplicated: control.value + DUPLICATION_MESSAGE };
  };
}

export function validateGeneratedFlavorsUnicity(existing: IDisplayElement[]): ValidatorFn {
  return (control: AbstractControl) => {
    const controlValue = control.value ? control.value.toLowerCase() : '';
    const isDuplicate = existing.some((x) => x.flavorExt && x.flavorExt.toLowerCase() === controlValue);

    return isDuplicate ? { duplicated: control.value + DUPLICATION_MESSAGE } : null;
  };
}

export function validateAddIngUnity(existing: IAddingInfo[], fixedName: string, domainInfo: IDomainInfo, id: string): ValidatorFn {
  return (control: AbstractControl) => {
    return !isAdded(fixedName, control.value, domainInfo, existing, id) ? null : { added: control.value + DUPLICATION_MESSAGE };
  };
}
