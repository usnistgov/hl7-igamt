import { Type } from '../constants/type.enum';
import { IValuesetBinding } from './binding.interface';
import { IPath } from './cs.interface';

export interface ICoConstraintTable {
  id: string;
  baseSegment: string;
  headers: ICoConstraintHeaders;
  coconstraints: ICoConstraint[];
  groups: ICoConstraintGroupBinding[];
}

export interface ICoConstraintGroup {
  id: string;
  baseSegment: string;
  name: string;
  headers: ICoConstraintHeaders;
  coconstraints: ICoConstraint[];
}

export interface ICoConstraintGroupBinding {
  requirement: ICoConstraintRequirement;
  type: ICoConstraintGroupBindingType;
}

export interface ICoConstraintGroupBindingRef extends ICoConstraintGroupBinding {
  refId: string;
}

export interface ICoConstraintGroupBindingContained extends ICoConstraintGroupBinding {
  name: string;
  coconstraints: ICoConstraint[];
}

export interface ICoConstraintHeaders {
  selectors: ICoConstraintHeader[];
  constraints: ICoConstraintHeader[];
  narratives: ICoConstraintHeader[];
}

export interface ICoConstraintHeader {
  key: string;
}

export interface IDataElementHeader extends ICoConstraintHeader {
  path: IPath;
  elementType: Type;
  columnType: ICoConstraintColumnType;
}

export interface INarrativeHeader extends ICoConstraintHeader {
  title: string;
}

export interface ICoConstraint {
  requirement: ICoConstraintRequirement;
  cells: {
    [key: string]: ICoConstraintCell;
  };
}

export interface ICoConstraintCell {
  type: ICoConstraintColumnType;
}

export interface ICoConstraintCodeCell {
  code: string;
  codeSystem: string;
  locations: number[];
}

export interface ICoConstraintValueSetCell {
  bindings: IValuesetBinding[];
}

export interface ICoConstraintDatatypeCell {
  datatypeId: string;
}

export interface ICoConstraintValueCell {
  value: string;
}

export enum ICoConstraintColumnType {
  CODE = 'CODE',
  VALUESET = 'VALUESET',
  DATATYPE = 'DATATYPE',
  VALUE = 'VALUE',
}

export enum ICoConstraintGroupBindingType {
  REF = 'REF',
  CONTAINED = 'CONTAINED',
}

export interface ICoConstraintRequirement {
  usage: string;
  cardinality: {
    min: number;
    max: string;
  };
}
