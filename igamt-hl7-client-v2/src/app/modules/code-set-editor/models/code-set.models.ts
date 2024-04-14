import { IEditorMetadata } from '../../dam-framework';
import { DiscoverableListItem } from '../../document/models/document/ig-list-item.class';
import { ICodes } from '../../shared/models/value-set.interface';

export interface  ICodeSetInfo {
  id?: string;
  metadata: ICodeSetInfoMetadata;
  exposed?: boolean;
  children?: ICodeSetVersionInfo[];
  defaultVersion?: string;
}

export interface  ICodeSetInfoMetadata {
 title?: string;
 description?: string;
}

export interface  ICodeSetVersionInfo {
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

export interface ICodeSetReference  {
  codeSetId: string;
  versionId?: string;

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
}

export type ICodeSetItemType = 'PUBLIC' | 'PRIVATE' | 'DISCOVERABLE' | 'SHARED';
