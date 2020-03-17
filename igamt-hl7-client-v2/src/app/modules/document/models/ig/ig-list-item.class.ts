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
  conformanceProfiles: string[];
  status: any;
}

export type IgListItemType = 'USER' | 'PUBLISHED';
