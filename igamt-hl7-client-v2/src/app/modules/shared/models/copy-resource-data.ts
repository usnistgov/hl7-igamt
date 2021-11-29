import {Scope} from '../constants/scope.enum';
import {Type} from '../constants/type.enum';
import {IDisplayElement} from './display-element.interface';

export interface ICopyResourceData {
  element: IDisplayElement;
  existing: IDisplayElement[];
  targetScope?: Scope;
  title?: string;
  master?: boolean;
  documentType?: Type;
}
