import { DiscoverableListItem } from './../../document/models/document/ig-list-item.class';

export class IWorkspaceListItem extends DiscoverableListItem {
  position: number;
  description: string;
  coverPicture?: any;
  subtitle: string;
  dateUpdated: string;
  type: IWorkspaceListItemType;
  username: any;
  participants?: any;
  elements?: string[];
  status: any;
  sharePermission?: string;
  sharedUsers?: string[];
  currentAuthor?: string;
}

export type IWorkspaceListItemType = 'PUBLIC' | 'PRIVATE' | 'DISCOVERABLE' | 'SHARED';
