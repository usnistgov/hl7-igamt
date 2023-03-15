import { IDocument } from '../../../document/models/document/IDocument.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IRegistry } from '../../../shared/models/registry.interface';
import { IVerificationEnty } from './../../../dam-framework/models/data/workspace';

export interface IgDocument extends IDocument {
  datatypeRegistry: IRegistry;
  segmentRegistry: IRegistry;
  profileComponentRegistry: IRegistry;
  compositeProfileRegistry: IRegistry;
  conformanceProfileRegistry: IRegistry;
  coConstraintGroupRegistry: IRegistry;
  valueSetRegistry: IRegistry;
  label?: any;
  derived: boolean;
}

export interface IDocumentDisplayInfo<T extends IDocument> {
  ig: T;
  segments?: IDisplayElement[];
  valueSets?: IDisplayElement[];
  datatypes?: IDisplayElement[];
  messages?: IDisplayElement[];
  profileComponents?: IDisplayElement[];
  compositeProfiles?: IDisplayElement[];
  coConstraintGroups?: IDisplayElement[];
  targetResourceId?: string;
}

export interface ITocVerification {
  [id: string]: ITocElement;
}
export interface ITocElement {
  [serverity: string]: IVerificationEnty[];
}

export interface IgDocumentStatusInfo {
  derived?: boolean;
  draft?: boolean;
  published?: boolean;
  deprecated?: boolean;
  locked?: boolean;
}
