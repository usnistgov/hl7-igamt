import { Type } from '../../../shared/constants/type.enum';
import { IAddingInfo } from '../../../shared/models/adding-info';
import {IOrderedProfileComponentLink} from '../../../shared/models/composite-profile';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IRegistry } from '../../../shared/models/registry.interface';

export interface IAddNodes {
  documentId: string;
  selected: IAddingInfo[];
  type: Type;
}

export interface ICopyNode {
  documentId: string;
  selected: IAddingInfo;
}

export interface IDeleteNode {
  documentId: string;
  element: IDisplayElement;
  parent?: IDisplayElement;
}
export interface IDeleteNodes {
  documentId: string;
  ids: string[]
  type: Type;
}
export interface ICopyResourceResponse {
  documentId?: string;
  id: string;
  reg: IRegistry;
  display: IDisplayElement;
}

export interface ICreateCoConstraintGroupResponse {
  id: string;
  registry: IRegistry;
  display: IDisplayElement;
}

export interface ICreateCoConstraintGroup {
  documentId?: string;
  name: string;
  baseSegment: string;
}
export interface ICreateProfileComponent {
  documentId?: string;
  name: string;
  children: IDisplayElement[];
}

export interface IAddProfileComponentContext {
  documentId?: string;
  pcId: string;
  added: IDisplayElement[];
}
export interface ICreateProfileComponentResponse {
  id: string;
  registry: IRegistry;
  display: IDisplayElement;
}
export interface IAddProfileComponentContextResponse {
  pcId: string;
  registry: IRegistry;
  pcDisplay: IDisplayElement;
}

export interface IAddResourceFromFile {
  documentId?: string;
  id: string;
  reg: IRegistry;
  display: IDisplayElement;
}

export interface ICreateCompositeProfile {
  documentId?: string;
  name: string;
  conformanceProfileId?: string;
  flavorsExtension?: string;
  orderedProfileComponents?: IOrderedProfileComponentLink[];
}
