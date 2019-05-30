import {IComment} from './comment.interface';

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
export interface IStructureElementBinding extends IBinding {
  comments?: IComment[] ;
  valuesetBindings: IValuesetBinding[];
  internalSingleCode: InternalSingleCode;
  externalSingleCode: IExternalSingleCode;
  constantValue: string;
  predicateId: string;
}

export interface IResourceBinding extends IBinding {
  conformanceStatementIds: string[];
}
