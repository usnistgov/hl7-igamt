import { Scope } from '../constants/scope.enum';
import { Type } from '../constants/type.enum';
import { Status } from '../models/abstract-domain.interface';
import { IConventionError } from '../models/convention-error';
import { IDisplayElement } from '../models/display-element.interface';
import { IDomainInfo } from '../models/domain-info.interface';
import { IAddingInfo } from './../models/adding-info';

export function isDuplicated(
  fixedName: string,
  variableName: string,
  domainInfo: IDomainInfo,
  existing: IDisplayElement[]
) {
  if (!variableName || variableName.length < 1) {
    return false;
  }
  if (!existing || existing.length < 1) {
    return false;
  }
  const sameStructure = existing.filter(
    (x) => (x.fixedName || '') === (fixedName || '') && x.domainInfo.version === domainInfo.version
  );
  const variableNameLower = variableName.toLowerCase();
  const filtered = sameStructure.filter((x: IDisplayElement) => {
    return x.variableName && x.variableName.toLowerCase() === variableNameLower;
  });
  return filtered.length > 0;
}

export function isDuplicatedLabelStructure(
  name: string,
  inputValue: string,
  domainInfo: IDomainInfo,
  existing: IDisplayElement[]
) {
  const filtered = existing.filter((x: IDisplayElement) => {
    if (x.domainInfo.version !== domainInfo.version) {
      return false;
    } else {
      if (x.status === Status.PUBLISHED) {
        return x.resourceName + x.flavorExt === name + inputValue;
      } else {
        return x.resourceName + x.variableName === name + inputValue;
      }
    }
  });
  return filtered.length > 0;
}

export function isAdded(
  fixedName: string,
  variableName: string,
  domainInfo: IDomainInfo,
  existing: IAddingInfo[],
  id: string
) {
  if (existing && existing.length > 0) {
    const filtered = existing.filter((x: IAddingInfo) => {
      return (
        x.id !== id && x.name === fixedName && x.domainInfo.version === domainInfo.version && x.ext === variableName
      );
    });
    return filtered.length > 0;
  } else {
    return false;
  }
}

export function validConvention(
  scope: Scope,
  type: Type,
  ext: string,
  documentType: Type,
  admin: boolean
): IConventionError {
  const initial: IConventionError = { valid: true };
  if (ext) {
    if (documentType === Type.DATATYPELIBRARY && admin) {
      return initial;
    } else {
      if (
        scope === Scope.USER &&
        (type === Type.DATATYPE || type === Type.SEGMENT) &&
        !/^[A-Za-z][\w-]{0,7}$/.test(ext)
      ) {
        return {
          valid: false,
          error:
            'User extension must start with a letter and must not be longer than 8 characters and can only contain letters, numbers, - (dash) and _ (underscore)',
        };
      }
    }
  }
  return initial;
}

export function validateStructureNamingConvention(value: string): IConventionError {
  const initial: IConventionError = { valid: true };
  if (value) {
    if (!startWithLetter(value)) {
      return { valid: false, error: 'Name must start with a letter' };
    } else if (value.length > 4) {
      return { valid: false, error: 'Name is too long' };
    }
  }
  return initial;
}

export function startWithLetter(ext: string) {
  return (ext.length > 0 && isLetter(ext.substring(0, 1))) || !ext.length;
}

export function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}
