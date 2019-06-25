import { IResourceBinding } from './binding.interface';
import { IComment } from './comment.interface';
import { IRef } from './ref.interface';
import { IResource } from './resource.interface';
import { IStructureElement } from './structure-element.interface';

export interface IMsgStructElement extends IStructureElement {
  min: number;
  max: string;
  comments: IComment[];
}

export interface IGroup extends IMsgStructElement {
  children: IMsgStructElement[];
}
export interface ISegmentRef extends IMsgStructElement {
  ref: IRef;
}
export interface IConformanceProfile extends IResource {
  identifier: string;
  messageType: string;
  event: string;
  structID: string;
  children: IMsgStructElement[];
  binding?: IResourceBinding;
}
