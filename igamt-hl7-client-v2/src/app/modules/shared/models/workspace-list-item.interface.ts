import {  DiscoverableListItem } from './../../document/models/document/ig-list-item.class';
export class IWorkspaceListItem  extends DiscoverableListItem {
  position: number;
  coverPicture?: any;
  subtitle: string;
  dateUpdated: string;
  type: IWorkspaceListItemType;
  username: any;
  participants?: any;
  elements?: string[];
  status: any;
  sharePermission?: string;x
  sharedUsers?: string[];
  currentAuthor?: string;
}

export type IWorkspaceListItemType = 'PUBLIC' | 'PRIVATE' | 'DISCOVERABLE' | 'SHARED';
