import { IPublicationInfo } from './../../../shared/models/publication-info.interface';
export class IgListItem {
  title: string;
  position: number;
  coverpage?: any;
  subtitle: string;
  dateUpdated: string;
  type: IgListItemType;
  id: string;
  username: any;
  participants?: any;
  elements?: string[];
  status: any;
  sharePermission?: string;
  sharedUsers?: string[];
  currentAuthor?: string;
  draft?: boolean;
  deprecated?: boolean;
  publicationInfo?: IPublicationInfo;
}

export type IgListItemType = 'USER' | 'PUBLISHED' | 'SHARED';
