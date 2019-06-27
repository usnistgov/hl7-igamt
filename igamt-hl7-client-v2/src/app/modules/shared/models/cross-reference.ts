import {Type} from '../constants/type.enum';
import {Usage} from '../constants/usage.enum';
import {IDisplayElement} from './display-element.interface';

export interface IReferenceLocation {
  type: Type;
  path: string;
  label: string;
}
export interface IReferenceIndentifier {
  id?: string;
  type?: Type;
}
export interface IRelationShip {
  id?: string;
  usage?: Usage;
  child: IReferenceIndentifier;
  parent: IReferenceIndentifier;
  location: IReferenceLocation;
}

export interface IUsages {
  usage?: Usage;
  element: IDisplayElement;
  location: IReferenceLocation;
}
