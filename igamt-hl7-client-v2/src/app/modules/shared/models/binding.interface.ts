import { IComment } from './comment.interface';

export enum LocationType {
  FIELD = 'FIELD', COMPONENT = 'COMPONENT', SUBCOMPONENT = 'SUBCOMPONENT', SEGREF = 'SEGREF', GROUP = 'GROUP',

}
export interface ILocationInfo {
  type: LocationType;
  position: number;
  name: string;
}

export enum IValuesetStrength {
  R = 'Required', S = 'Suggested', U = 'Unspecified',
}

export interface IValuesetBinding {
  valuesetId: string;
  strength: IValuesetStrength;
  valuesetLocations: number[];
}

export interface InternalSingleCode {
  codeId: string;
  codeSystemId: string;
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
  externalSingleCode: IExternalSingleCode;
  predicateId: string;
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
