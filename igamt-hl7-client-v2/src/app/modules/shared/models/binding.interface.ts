import { Type } from '../constants/type.enum';
import { IConformanceStatement } from './cs.interface';
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
  conformanceStatements: IConformanceStatement[];
}

export enum IBindingType {
  VALUESET = 'VALUESET',
  SINGLECODE = 'SINGLECODE',
}

export interface IFlatResourceBindings {
  valueSetBindingContainers: Array<IBindingContainerDisplay<IValuesetBinding[]>>;
  singleCodeBindingContainers: Array<IBindingContainerDisplay<InternalSingleCode>>;
  conformanceStatementBindingContainers: Array<IBindingContainerDisplay<IConformanceStatement>>;
  predicateBindingContainers: Array<IBindingContainerDisplay<IPredicate>>;
}

export interface IBindingContainerDisplay<T> {
  locationInfo: IHL7LocationInfo;
  binding: IBindingContainer<T>;
}

export interface IBindingContainer<T> {
  pathId: string;
  value: T;
}
export interface IHL7LocationInfo {
  name: string;
  hl7Path: string;
  type: Type;
  positionalPath: string;
}
