import { IEditorMetadata } from '../../dam-framework';
import { DiscoverableListItem } from '../../document/models/document/ig-list-item.class';
import { CodeUsage } from '../../shared/constants/usage.enum';
import { ICodes } from '../../shared/models/value-set.interface';

export interface ICodeSetInfo {
  id?: string;
  metadata: ICodeSetInfoMetadata;
  disableKeyProtection: boolean;
  exposed?: boolean;
  children?: ICodeSetVersionInfo[];
  defaultVersion?: string;
  viewOnly: boolean;
  published: boolean;
}

export interface ICodeSetInfoMetadata {
  title?: string;
  description?: string;
}

export interface ICodeSetVersionInfo {
  id: string;
  type: 'CODESETVERSION';
  version: string;
  exposed: boolean;
  date: string;
  comment: string;
  parentId: string;
  dateCreated?: string;
  dateCommitted?: string;
  deprecated?: boolean;
  latest?: boolean;
  parentName?: string;
  latestStable: boolean;
}

export interface ICodeSetActive {
  display: any;
  editor: IEditorMetadata;
}

export interface ICodeSetVersionContent extends ICodeSetVersionInfo {
  codes: ICodes[];
  codeSystems: string[];
  codeSetReference: ICodeSetReference;
}

export interface ICodeSetReference {
  codeSetId: string;
  versionId?: string;

}

export interface ICodePropertyDelta<T> {
  current: T;
  previous: T;
  change: DeltaChange;
}

export enum DeltaChange {
  ADDED = 'ADDED', DELETED = 'DELETED', CHANGED = 'CHANGED', NONE = 'NONE',
}

export interface ICodeDelta {
  change: DeltaChange;
  value: ICodePropertyDelta<string>;
  description: ICodePropertyDelta<string>;
  codeSystem: ICodePropertyDelta<string>;
  hasPattern?: ICodePropertyDelta<boolean>;
  usage?: ICodePropertyDelta<CodeUsage>;
  pattern: ICodePropertyDelta<string>;
  comments: ICodePropertyDelta<string>;
}

export class ICodeSetListItem extends DiscoverableListItem {
  position: number;
  description: string;
  coverPicture?: any;
  subtitle: string;
  dateUpdated: string;
  type: ICodeSetItemType;
  username: any;
  participants?: any;
  elements?: string[];
  status: any;
  sharePermission?: string;
  sharedUsers?: string[];
  currentAuthor?: string;
  invitation?: boolean;
  dateCreated?: string;
  dateCommitted?: string;
  disableKeyProtection: boolean;
  published: boolean;
}

export class ICodeSetCommit {
  version: string;
  comments: string;
  markAsLatestStable: boolean;
}

export type ICodeSetItemType = 'PUBLIC' | 'PRIVATE' | 'DISCOVERABLE' | 'SHARED';
