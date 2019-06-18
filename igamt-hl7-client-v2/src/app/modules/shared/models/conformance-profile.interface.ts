import {IResourceBinding} from './binding.interface';
import {IRef} from './ref.interface';
import {IResource} from './resource.interface';
import {IStructureElement} from './structure-element.interface';

export interface IGroup extends IStructureElement {
  children: IStructureElement[];
}
export interface ISegmentRef  extends IStructureElement {
  ref: IRef;
}
export interface IConformanceProfile extends IResource {
  identifier: string;
  messageType: string;
  event: string;
  structID: string;
  children: IStructureElement[];
  binding?: IResourceBinding;
}
