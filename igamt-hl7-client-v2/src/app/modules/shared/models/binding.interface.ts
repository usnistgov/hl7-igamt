import { IPredicate } from './predicate.interface';
import { IChangeLog } from './save-change';

export enum LocationType {
  FIELD = 'FIELD', COMPONENT = 'COMPONENT', SUBCOMPONENT = 'SUBCOMPONENT', SEGREF = 'SEGREF', GROUP = 'GROUP',

}
export interface ILocationInfo {
  type: LocationType;
  position: number;
  name: string;
}

export enum IValuesetStrength {
  R = 'R', S = 'S', U = 'U',
}

export interface IValuesetBinding {
  strength: IValuesetStrength;
  valuesetLocations: number[];
  valueSets: string[];
}

export interface InternalSingleCode {
  valueSetId: string;
  codeSystem: string;
  code: string;
}

export interface IExternalSingleCode {
  value: string;
  codeSystem: string;
}

export interface IBinding {
  elementId?: string;
  locationInfo?: ILocationInfo;
  children?: IStructureElementBinding[];
}

export interface IStructureElementBindingProperties {
  valuesetBindings: IValuesetBinding[];
  internalSingleCode: InternalSingleCode;
  externalSingleCode?: IExternalSingleCode;
  predicate?: IPredicate;
  changeLog?: IChangeLog;
}

export interface IStructureElementBinding extends IBinding, IStructureElementBindingProperties {
}

export interface IResourceBinding extends IBinding {
  conformanceStatementIds: string[];
}

export enum IBindingType {
  VALUESET = 'VALUESET',
  SINGLECODE = 'SINGLECODE',
}
