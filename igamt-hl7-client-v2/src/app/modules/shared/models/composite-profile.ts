import { IConformanceProfile, IMessageProfileIdentifier } from './conformance-profile.interface';
import { IDatatype } from './datatype.interface';
import { IDisplayElement } from './display-element.interface';
import { IResource } from './resource.interface';
import { ISegment } from './segment.interface';

export interface IOrderedProfileComponentLink {
  position: number;
  profileComponentId: string;
}

export interface ICompositeProfile extends IResource {
  conformanceProfileId: string;
  orderedProfileComponents: IOrderedProfileComponentLink[];
  preCoordinatedMessageIdentifier?: IMessageProfileIdentifier;
  flavorsExtension: string;

}

export interface ICompositeProfileState {
  conformanceProfile: IResourceAndDisplay<IConformanceProfile>;
  datatypes: Array<IResourceAndDisplay<IDatatype>>;
  segments: Array<IResourceAndDisplay<ISegment>>;
  resources: IResource[];
}

export interface IResourceAndDisplay<T extends IResource> {
  display: IDisplayElement;
  resource: T;
}
