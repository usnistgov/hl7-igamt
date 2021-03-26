import {IResource} from './resource.interface';

export interface IOrderedProfileComponentLink {
  position: number;
  profileComponentId: string;
}

export interface ICompositeProfile extends IResource {
  conformanceProfileId: string;
  orderedProfileComponents: IOrderedProfileComponentLink[];
}
