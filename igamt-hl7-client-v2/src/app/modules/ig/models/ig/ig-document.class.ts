import {Type} from '../../../shared/constants/type.enum';

export interface IgDocument {
  id: string;
  name?: any;
  publicationInfo?: any;
  domainInfo: IDomainInfo;
  username: string;
  comment?: any;
  description?: any;
  createdFrom?: any;
  authorNotes?: any;
  usageNotes?: any;
  origin?: any;
  creationDate: string;
  updateDate: string;
  from: string;
  version: number;
  metadata: IMetadata;
  content: IContent[];
  datatypeRegistry: IRegistry;
  segmentRegistry: IRegistry;
  profileComponentRegistry: IRegistry;
  compositeProfileRegistry: IRegistry;
  conformanceProfileRegistry: IRegistry;
  valueSetRegistry: IRegistry;
  label?: any;
}

export interface IRegistry {
  children: IResource[];
  type: string;
}
export interface IGDisplayInfo {
  ig: IgDocument;
  segments: IDisplayElement[];
  valueSets: IDisplayElement[];
  datatypes: IDisplayElement[];
  messages: IDisplayElement[];
}
export interface IDisplayElement {
  id: string;
  fixedName: string;
  variableName: string;
  description: string;
  domainInfo: IDomainInfo;
  type: Type;
  leaf: boolean;
  position?: number;
  differantial: boolean;
  children?: IDisplayElement[];
  isExpanded: boolean;
}

export interface IResource {
  id: string;
  position: number;
  domainInfo: IDomainInfo;
  type?: any;
}

export interface IContent {
  id: string;
  description?: any;
  type: Type;
  position: number;
  label: string;
  children: IContent[];
}

export interface IMetadata {
  title: string;
  topics: string;
  specificationName: string;
  identifier?: any;
  implementationNotes?: any;
  orgName: string;
  coverPicture?: any;
  subTitle: string;
  scope?: any;
}

export interface IDomainInfo {
  version: any;
  compatibilityVersion: any[];
  scope: string;
}
