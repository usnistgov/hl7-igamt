import { Type } from '../constants/type.enum';
import { IDomainInfo } from './domain-info.interface';
import { IPublicationInfo } from './publication-info.interface';

export interface IDocumentRef {
  documentId: string;
  type: Type;
}

export interface IAbstractDomain {
  id: string;
  creationDate?: string;
  updateDate?: string;
  name: string;
  type: Type;
  origin?: string;
  publicationInfo?: IPublicationInfo;
  domainInfo: IDomainInfo;
  username?: string;
  comment?: string;
  description?: string;
  createdFrom?: string;
  authorNotes?: string;
  usageNotes?: string;
  organization: string;
  authors: string[];
  status: Status;
  from?: string;
  version?: number;
  dateTimeConstraints?: any;
  sharePermission?: string;
  activeInfo?: IActiveInfo;
}
export enum Status {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SUPERSEDED = 'SUPERSEDED',
  WITHDRAWN = 'WITHDRAWN',
}
export enum ActiveStatus {
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
}
export enum SharePermission {
  READ = 'READ',
  WRITE = 'WRITE',
}

export interface IActiveInfo {
  start?: string;
  end?: string;
  status?: ActiveStatus;
}
