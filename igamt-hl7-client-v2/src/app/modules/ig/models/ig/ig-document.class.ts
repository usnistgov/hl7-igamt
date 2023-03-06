import { IDocument } from '../../../document/models/document/IDocument.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IRegistry } from '../../../shared/models/registry.interface';
import { IVerificationEnty } from './../../../dam-framework/models/data/workspace';
import { IVerificationEntryList } from './../../../shared/services/verification.service';

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
  audience: IAudience;
}

export enum AudienceType {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  WORKSPACE = 'WORKSPACE',
}

export interface IAudience {
  type: AudienceType;
}

export interface IPrivateAudience extends IAudience {
  type: AudienceType.PRIVATE;
  editor: string;
  viewers: string[];
}

export interface IPublicAudience {
  type: AudienceType.PUBLIC;
}

export interface IWorkspaceAudience {
  type: AudienceType.WORKSPACE;
  workspaceId: string;
  folderId: string;
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
  documentLocation?: IDocumentLocation[];
  resourceVersionSyncToken: string;
}

export interface IIgUpdateInfo {
  updateDate: Date;
  resourceVersionSyncToken: string;
}

export interface IDocumentLocation {
  position: number;
  type: DocumentLocationType;
  id: string;
  label: string;
}

export enum DocumentLocationType {
  SCOPE = 'SCOPE',
  WORKSPACE = 'WORKSPACE',
  FOLDER = 'FOLDER',
}

export interface IIgLocationValue {
  id: string;
  location?: IDocumentLocation[];
}

export interface ITocVerification {
  [id: string]: ITocElement;
}
export interface ITocElement {
  [serverity: string]: IVerificationEnty[];
}
