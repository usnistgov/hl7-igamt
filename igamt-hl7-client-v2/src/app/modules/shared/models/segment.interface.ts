import { IResourceBinding } from './binding.interface';
import { IComment } from './comment.interface';
import { IResource } from './resource.interface';
import { ISubStructElement } from './structure-element.interface';

export interface IField extends ISubStructElement {
  min: number;
  max: string;
  constantValue: string;
  comments: IComment[];
}

export interface IDynamicMappingItem {
  datatypeId?: string;
  value?: string;
}

export interface IDynamicMappingInfo {
  referenceFieldId?: string;
  variesFieldId?: string;
  items?: IDynamicMappingItem[];
}

export interface ISegment extends IResource {
  ext?: string;
  binding?: IResourceBinding;
  children: IField[];
  dynamicMappingInfo?: IDynamicMappingInfo;
}
