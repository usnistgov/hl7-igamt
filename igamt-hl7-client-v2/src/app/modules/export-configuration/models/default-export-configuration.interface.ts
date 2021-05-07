import {ExportTypes} from './export-types';

export interface IExportConfiguration {
  configName: string;
  coConstraintExportMode: any;
  id: string;
  defaultConfig: boolean;
  original: boolean;
  datatypeLibraryExportConfiguration: IDatatypeLibraryExportConfiguration;
  datatypeExportConfiguration: IDatatypeExportConfiguration;
  segmentExportConfiguration: ISegmentExportConfiguration;
  conformamceProfileExportConfiguration: IConformamceProfileExportConfiguration;
  valueSetExportConfiguration: IValueSetExportConfiguration;
  abstractDomainExportConfiguration: IAbstractDomainExportConfiguration;
  resourceExportConfiguration?: any;
  defaultType: boolean;
  name?: any;
  username?: any;
  unboundHL7: boolean;
  unboundCustom: boolean;
  includeVaries: boolean;
  includeMessageTable: boolean;
  includeSegmentTable: boolean;
  includeDatatypeTable: boolean;
  includeValuesetsTable: boolean;
  includeCompositeProfileTable: boolean;
  includeProfileComponentTable: boolean;
  greyOutOBX2FlavorColumn: boolean;
  includeDerived: boolean;
  segmentORGroupsMessageExport: IUsageConfiguration;
  segmentORGroupsCompositeProfileExport: IUsageConfiguration;
  segmentsExport: IUsageConfiguration;
  fieldsExport: IUsageConfiguration;
  profileComponentItemsExport: IUsageConfiguration;
  valuesetsExport: IUsageConfiguration;
  includeComposition: boolean;
  codesExport: ICodesExport;
  phinvadsUpdateEmailNotification: boolean;
  datatypesExport: IUsageConfiguration;
  componentExport: IUsageConfiguration;
  messageColumn: IMessageColumn;
  compositeProfileColumn: IMessageColumn;
  segmentColumn: IMessageColumn;
  profileComponentColumn: IMessageColumn;
  datatypeColumn: IMessageColumn;
  valuesetColumn: IMessageColumn;
  valuesetsMetadata: IValueSetMetadataConfig;
  datatypeMetadataConfig: IMetadataConfig;
  segmentMetadataConfig: IMetadataConfig;
  messageMetadataConfig: IMetadataConfig;
  compositeProfileMetadataConfig: IMetadataConfig;
  maxCodeNumber: number;
  datatypeLibraryIncludeSummary: boolean;
  datatypeLibraryIncludeDerived: boolean;
  documentMetadataConfiguration?: any;
  deltaMode?: boolean;
  deltaConfig?: any;
  type: ExportTypes;
}

export interface IMessageColumn {
  columns: IColumn[];
}

export interface IAbstractDomainExportConfiguration {
  creationDate: boolean;
  updateDate: boolean;
  name: boolean;
  type: boolean;
  origin: boolean;
  publicationInfo: boolean;
  publicationDate: boolean;
  domainInfo: boolean;
  comment: boolean;
  description: boolean;
  createdFrom: boolean;
  authorNotes: boolean;
  usageNotes: boolean;
  from: boolean;
  version: boolean;
  domainCompatibilityVersion: boolean;
}

export interface IValueSetExportConfiguration {
  creationDate: boolean;
  updateDate: boolean;
  name: boolean;
  type: boolean;
  origin: boolean;
  publicationInfo: boolean;
  publicationDate: boolean;
  domainInfo: boolean;
  comment: boolean;
  description: boolean;
  createdFrom: boolean;
  authorNotes: boolean;
  usageNotes: boolean;
  from: boolean;
  version: boolean;
  domainCompatibilityVersion: boolean;
  preDef: boolean;
  postDef: boolean;
  includeValuesetsTable: boolean;
  valuesetsExport: IUsageConfiguration;
  codesExport: ICodesExport;
  columns: IColumn[];
  metadataConfig: IValueSetMetadataConfig;
  unboundHL7: boolean;
  unboundCustom: boolean;
  phinvadsUpdateEmailNotification: boolean;
  codeNumber: number;
  maxCodeNumber: number;
  stability: boolean;
  extensibility: boolean;
  contentDefinition: boolean;
  uRL: boolean;
  deltaMode?: boolean;
  deltaConfig?: any;
}

export interface IValueSetMetadataConfig {
  stability: boolean;
  extensibility: boolean;
  contentDefinition: boolean;
  oid: boolean;
  type: boolean;
  url: boolean;
}

export interface ICodesExport {
  r: boolean;
  p: boolean;
  e: boolean;
}

export interface IConformamceProfileExportConfiguration {
  creationDate: boolean;
  updateDate: boolean;
  name: boolean;
  type: boolean;
  origin: boolean;
  publicationInfo: boolean;
  publicationDate: boolean;
  domainInfo: boolean;
  comment: boolean;
  description: boolean;
  createdFrom: boolean;
  authorNotes: boolean;
  usageNotes: boolean;
  from: boolean;
  version: boolean;
  domainCompatibilityVersion: boolean;
  preDef: boolean;
  postDef: boolean;
  identifier: boolean;
  messageType: boolean;
  event: boolean;
  structID: boolean;
  binding: boolean;
  includeMessageTable: boolean;
  segmentORGroupsMessageExport: IUsageConfiguration;
  columns: IColumn[];
  metadataConfig: IMetadataConfig;
  constraintExportConfiguration: IConstraintExportConfiguration;
  deltaMode?: boolean;
  deltaConfig?: any;
}

export interface ISegmentExportConfiguration {
  creationDate: boolean;
  updateDate: boolean;
  name: boolean;
  type: boolean;
  origin: boolean;
  publicationInfo: boolean;
  publicationDate: boolean;
  domainInfo: boolean;
  comment: boolean;
  description: boolean;
  createdFrom: boolean;
  authorNotes: boolean;
  usageNotes: boolean;
  from: boolean;
  version: boolean;
  domainCompatibilityVersion: boolean;
  preDef: boolean;
  postDef: boolean;
  dynamicMappingInfo: boolean;
  binding: boolean;
  constraintExportConfiguration: IConstraintExportConfiguration;
  coConstraintExportMode: any;
  includeSegmentTable: boolean;
  greyOutOBX2FlavorColumn: boolean;
  segmentsExport: IUsageConfiguration;
  fieldsExport: IUsageConfiguration;
  columns: IColumn[];
  metadataConfig: IMetadataConfig;
  deltaMode?: boolean;
  deltaConfig?: any;
}

export interface IDatatypeLibraryExportConfiguration {
  datatypeName: boolean;
  datatypeFlavor: boolean;
  shortDescription: boolean;
  hl7version: boolean;
  publicationDate: boolean;
  status: boolean;
  creationDate: boolean;
  updateDate: boolean;
  name: boolean;
  type: boolean;
  origin: boolean;
  publicationInfo: boolean;
  domainInfo: boolean;
  comment: boolean;
  description: boolean;
  createdFrom: boolean;
  authorNotes: boolean;
  usageNotes: boolean;
  from: boolean;
  version: boolean;
  domainCompatibilityVersion: boolean;
  preDef: boolean;
  postDef: boolean;
  purposeAndUse: boolean;
  binding: boolean;
  constraintExportConfiguration: IConstraintExportConfiguration;
  includeDatatypeTable: boolean;
  datatypesExport: IUsageConfiguration;
  columns: IColumn[];
  metadataConfig: IMetadataConfig;
  includeVaries: boolean;
}

export interface IDatatypeExportConfiguration {
  creationDate: boolean;
  updateDate: boolean;
  name: boolean;
  type: boolean;
  origin: boolean;
  publicationInfo: boolean;
  publicationDate: boolean;
  domainInfo: boolean;
  comment: boolean;
  description: boolean;
  createdFrom: boolean;
  authorNotes: boolean;
  usageNotes: boolean;
  from: boolean;
  version: boolean;
  domainCompatibilityVersion: boolean;
  preDef: boolean;
  postDef: boolean;
  purposeAndUse: boolean;
  binding: boolean;
  constraintExportConfiguration: IConstraintExportConfiguration;
  includeDatatypeTable: boolean;
  datatypesExport: IUsageConfiguration;
  componentExport: IUsageConfiguration;
  columns: IColumn[];
  metadataConfig: IMetadataConfig;
  includeVaries: boolean;
  deltaMode?: boolean;
  deltaConfig?: any;
}
export interface IMetadataConfig {
  datatypeName: boolean;
  datatypeFlavor: boolean;
  shortDescription: boolean;
  hl7version: boolean;
  publicationDate: boolean;
  status: boolean;
  publicationVersion: boolean;
  scope: boolean;
  preDefinition: boolean;
  postDefinition: boolean;
  usageNotes: boolean;
  authorNotes: boolean;
  organization: boolean;
  author: boolean;
  type: boolean;
  role: boolean;

}

interface IColumn {
  name: string;
  position: number;
  present: boolean;
  disabled: boolean;
}

export interface IUsageConfiguration {
  r: boolean;
  re: boolean;
  c: boolean;
  x: boolean;
  o: boolean;
  usagesToInclude: string[];
}

export interface IConstraintExportConfiguration {
  conformanceStatement: boolean;
  predicate: boolean;
}
