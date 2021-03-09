import {IAddProfileComponentContext} from '../../document/models/toc/toc-operation.class';
import {Type} from '../constants/type.enum';
import { IResourceBinding } from './binding.interface';
import { IComment } from './comment.interface';
import { IDisplayElement } from './display-element.interface';
import { IResource } from './resource.interface';
import {PropertyType} from './save-change';
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

export interface IDynamicMappingMap {
  [k: string]: IDisplayElement;
}

export interface IDynamicMappingNaming {
  [k: string]: IDisplayElement[];
}

export interface IDynamicMappingInfo {
  referenceFieldId?: string;
  variesFieldId?: string;
  items?: IDynamicMappingItem[];
}
export interface IDynamicMappingInfoDisplay {
  referenceFieldId?: string;
  variesFieldId?: string;
  mapping: IDynamicMappingMap;
}
export interface ISegment extends IResource {
  ext?: string;
  binding?: IResourceBinding;
  children: IField[];
  dynamicMappingInfo?: IDynamicMappingInfo;
}
export interface IProfileComponent extends IResource {
  children?: IProfileComponentContext;
}
export interface IProfileComponentContext {
  id: string;
  level: Type;
  sourceId: string;
  structure: string;
  position: number;
  profileComponentItems:  IProfileComponentItem[];
}
export interface IProfileComponentItem {
  path: string;
  itemProperties: ItemProperty[];
}

export interface ItemProperty {
  propertyKey: PropertyType;
  propertyValue: any;
}
