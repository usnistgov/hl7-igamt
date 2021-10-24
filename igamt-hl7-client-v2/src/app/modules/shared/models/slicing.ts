import {Type} from '../constants/type.enum';
import {IAssertion, IPath} from './cs.interface';

export enum ISlicingMethodType {
  ASSERTION = 'ASSERTION', OCCURENCE= 'OCCURENCE',
}

export interface ISlicing {
  type: ISlicingMethodType;
  slices: ISlice[];
  path: IPath;
}
export interface IConditionalSlicing extends ISlicing {
  type: ISlicingMethodType.ASSERTION;
  slices: IConditionalSlice[];
}
export interface IOrderedSlicing extends ISlicing {
  type: ISlicingMethodType.OCCURENCE;
  slices: IOrderedSlice[];
}
export interface  ISlice {
  comment: string;
  flavorId: string;
}
export interface IConditionalSlice extends ISlice {
  assertion: IAssertion;
  min?: number;
  max?: string;
}
export interface IOrderedSlice extends ISlice {
  position: number;
}
