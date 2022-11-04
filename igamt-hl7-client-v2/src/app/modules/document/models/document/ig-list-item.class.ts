import { Type } from 'src/app/modules/shared/constants/type.enum';
import { IPublicationInfo } from 'src/app/modules/shared/models/publication-info.interface';

export class DiscoverableListItem {
  id: string;
  title: string;
  resourceType: Type;
}
export class IgListItem extends DiscoverableListItem {
  position: number;
  coverpage?: any;
  subtitle: string;
  dateUpdated: string;
  type: IgListItemType;
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
