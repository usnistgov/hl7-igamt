import { Type } from '../constants/type.enum';
import { IValuesetBinding } from './binding.interface';

export interface ICoConstraintTable {
  id?: string;
  baseSegment: string;
  headers: ICoConstraintHeaders;
  coconstraints: ICoConstraint[];
  groups: ICoConstraintGroupBinding[];
}

export interface ICoConstraintGroup {
  id?: string;
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
  type: ICoConstraintHeaderType;
  key: string;
}

export interface IDataElementHeader extends ICoConstraintHeader {
  name: string;
  elementType: Type;
  columnType: ICoConstraintColumnType;
  elementInfo: IDataElementHeaderInfo;
}

export interface IDataElementHeaderInfo {
  version: string;
  parent: string;
  elementName: string;
  location: number;
  type: Type;
}

export interface INarrativeHeader extends ICoConstraintHeader {
  title: string;
}

export interface ICoConstraint {
  id: string;
  requirement: ICoConstraintRequirement;
  cells: ICoConstraintCells;
}

export interface ICoConstraintCells {
  [key: string]: ICoConstraintCell;
}

export interface ICoConstraintCell {
  type: ICoConstraintColumnType;
}

export interface ICoConstraintCodeCell extends ICoConstraintCell {
  code: string;
  codeSystem: string;
  locations: number[];
}

export interface ICoConstraintValueSetCell extends ICoConstraintCell {
  bindings: IValuesetBinding[];
}

export interface ICoConstraintDatatypeCell extends ICoConstraintCell {
  datatypeId: string;
}

export interface ICoConstraintValueCell extends ICoConstraintCell {
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

export enum ICoConstraintHeaderType {
  DATAELEMENT = 'DATAELEMENT',
  NARRATIVE = 'NARRATIVE',
}

export interface ICoConstraintRequirement {
  usage: string;
  cardinality: {
    min: number;
    max: string;
  };
}
