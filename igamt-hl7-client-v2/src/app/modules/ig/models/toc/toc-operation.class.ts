import {Type} from '../../../shared/constants/type.enum';
import {IAddingInfo} from '../../../shared/models/adding-info';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {IRegistry} from '../../../shared/models/registry.interface';
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
}
export interface ICopyResourceResponse {
  documentId?: string;
  id: string;
  reg: IRegistry;
  display: IDisplayElement;
}

export interface IAddResourceFromFile {
  documentId?: string;
  id: string;
  reg: IRegistry;
  display: IDisplayElement;
}
