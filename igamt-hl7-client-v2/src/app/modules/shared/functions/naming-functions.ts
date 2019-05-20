import {Scope} from '../constants/scope.enum';
import {Type} from '../constants/type.enum';
import {IConventionError} from '../models/convention-error';
import {IDisplayElement} from '../models/display-element.interface';
import {IDomainInfo} from '../models/domain-info.interface';

export function isDuplicated(fixedName: string, variableName: string, domainInfo: IDomainInfo, existing: IDisplayElement[]) {
    const filtered = existing.filter( (x: IDisplayElement) => {
      return x.fixedName === fixedName && x.variableName === variableName && x.domainInfo.scope === domainInfo.scope && x.domainInfo.version === domainInfo.version;
    });
    return filtered.length > 0;
}

export function validConvention(scope: Scope, type: Type, ext: string): IConventionError {
  if (ext) {
    if (scope === Scope.SDTF) {
      if ( !isTowDigets(ext)) {
        return {valid: false, error: 'The extension must be 2 Digets '};
      }
    } else if (scope === Scope.USER && (type === Type.DATATYPE || type === Type.SEGMENT)) {
      if (!startWithLetter(ext)) {
        return {valid: false, error: 'User extension must start with a letter'};
      } else if (ext.length !== 4) {
        return {valid: false, error: 'User extension must contain 4 characters'};
      }
    }
  }
  return {valid: true};
}

export function startWithLetter(ext) {
    return ext.length > 0 && isLetter(ext.substring(0, 1)) || !ext.length;
}

export function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

export function  isTowDigets(str) {
  return str.match(/^[0-9]{1,2}?$/);
}
