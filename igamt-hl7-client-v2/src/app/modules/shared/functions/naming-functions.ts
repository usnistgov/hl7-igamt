import {Scope} from '../constants/scope.enum';
import {Type} from '../constants/type.enum';
import {Status} from '../models/abstract-domain.interface';
import {IConventionError} from '../models/convention-error';
import {IDisplayElement} from '../models/display-element.interface';
import {IDomainInfo} from '../models/domain-info.interface';
import { IAddingInfo } from './../models/adding-info';

// export function isDuplicated(fixedName: string, variableName: string, domainInfo: IDomainInfo, existing: IDisplayElement[]) {
//     if (existing && existing.length > 0) {
//     const filtered = existing.filter( (x: IDisplayElement) => {

//       return ( fixedName && x.fixedName ? x.fixedName  === fixedName : true) && x.variableName === variableName && x.domainInfo.version === domainInfo.version;
//     });
//     return filtered.length > 0;
//     } else {
//       return false;
//     }
// }
export const specialChars = /[&<>"' \/ ]/;

export function isDuplicated(fixedName: string, variableName: string, domainInfo: IDomainInfo, existing: IDisplayElement[]) {

  if(!variableName || variableName.length<1){
    return false;
  }
  if(!existing|| existing.length <1){

    return false;
  }

  const sameStructure = existing.filter(x => x.fixedName === fixedName && domainInfo.version === domainInfo.version);

  console.log(sameStructure);
    const variableNameLower = variableName.toLowerCase();
    const filtered = sameStructure.filter((x: IDisplayElement) => {
      return x.variableName && x.variableName.toLowerCase() === variableNameLower;
    });

    return filtered.length > 0;

}



// export function isDuplicated(fixedName: string, variableName: string, domainInfo: IDomainInfo, existing: IDisplayElement[]) {
//   if (existing && existing.length > 0) {
//     const filtered = existing.filter((x: IDisplayElement) => {
//       const xFixedName = x.fixedName ? x.fixedName.toLowerCase() : '';
//       const xVariableName = x.variableName? x.variableName.toLowerCase(): '';
//       const xVersion = x.domainInfo.version.toLowerCase();

//       const fixedNameLower = fixedName ? fixedName.toLowerCase() : '';

//       return (fixedNameLower === xFixedName) && (variableName.toLowerCase() === xVariableName) && (domainInfo.version.toLowerCase() === xVersion);
//     });

//     return filtered.length > 0;
//   } else {
//     return false;
//   }

export function isDuplicatedLabelStructure(name: string, inputValue: string, domainInfo: IDomainInfo, existing: IDisplayElement[]) {

  const filtered = existing.filter( (x: IDisplayElement) => {
   if ( x.domainInfo.version !== domainInfo.version) {
     return false;
   } else {
     if ( x.status === Status.PUBLISHED ) {
       return x.resourceName + x.flavorExt  === name + inputValue;
     } else {
       return x.resourceName + x.variableName  === name + inputValue;
     }
   }
  });
  return filtered.length > 0;
}

export function isAdded(fixedName: string, variableName: string, domainInfo: IDomainInfo, existing: IAddingInfo[], id: string) {
  if (existing && existing.length > 0) {
    const filtered = existing.filter( (x: IAddingInfo) => {
      return x.id !== id && x.name === fixedName &&  x.domainInfo.version === domainInfo.version && x.ext === variableName; });
    return filtered.length > 0;
    } else { return false; }
  }

export function validConvention(scope: Scope, type: Type, ext: string, documentType: Type, admin: boolean): IConventionError {
   const initial: IConventionError = {valid: true};
   if (ext) {
     if (documentType === Type.DATATYPELIBRARY && admin) {
       return initial;
     } else {
       if (scope === Scope.USER && (type === Type.DATATYPE || type === Type.SEGMENT) ) {
       if (!startWithLetter(ext)) {
         return {valid: false, error: 'User extension must start with a letter'};
       } else if (ext.length > 8) {
         return {valid: false, error: 'User extension is too long'};
       }else if (!isValidXMLString(ext)) {

        return { valid: false, error: 'User extension cannot contain invalid XML characters ' + specialChars};
      }
      }
     }
   }
   return initial;
}

function isValidXMLString(value: string): boolean {
  return !specialChars.test(value);
}




export function validateStructureNamingConvention( value: string): IConventionError {
  const initial: IConventionError = {valid: true};

  console.log('called');
  if (value) {
    if (!startWithLetter(value)) {
      return {valid: false, error: 'Name must start with a letter'};
    } else if (value.length > 4) {
      return {valid: false, error: 'Name is too long'};
    }
  }
  return initial;

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
