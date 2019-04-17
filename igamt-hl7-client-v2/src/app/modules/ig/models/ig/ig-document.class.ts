interface IgDocument {
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

interface IRegistry {
  children: IResource[];
  type: string;
}

interface IResource {
  id: string;
  position: number;
  domainInfo: IDomainInfo;
  type?: any;
}

interface IContent {
  id: string;
  description?: any;
  type: string;
  position: number;
  label: string;
  children: IContent[];
}

interface IMetadata {
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

interface IDomainInfo {
  version: any;
  compatibilityVersion: any[];
  scope: string;
}
