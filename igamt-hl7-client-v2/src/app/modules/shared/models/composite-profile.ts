import { IResource } from './resource.interface';
import { IConformanceProfile } from './conformance-profile.interface';
import { IDisplayElement } from './display-element.interface';
import { IDatatype } from './datatype.interface';
import { ISegment } from './segment.interface';

export interface IOrderedProfileComponentLink {
  position: number;
  profileComponentId: string;
}

export interface ICompositeProfile extends IResource {
  conformanceProfileId: string;
  orderedProfileComponents: IOrderedProfileComponentLink[];
}

export interface ICompositeProfileState {
  conformanceProfile: IResourceAndDisplay<IConformanceProfile>;
  datatypes: Array<IResourceAndDisplay<IDatatype>>;
  segments: Array<IResourceAndDisplay<ISegment>>;
}

export interface IResourceAndDisplay<T extends IResource> {
  display: IDisplayElement;
  resource: T;
}
