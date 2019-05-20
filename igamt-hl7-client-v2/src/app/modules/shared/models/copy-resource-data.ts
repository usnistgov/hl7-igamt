import {Scope} from '../constants/scope.enum';
import {IDisplayElement} from './display-element.interface';

export interface ICopyResourceData {
  element: IDisplayElement;
  existing: IDisplayElement[];
  targetScope?: Scope;
}
