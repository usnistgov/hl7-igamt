import { Type } from '../constants/type.enum';
import { IValuesetBinding } from './binding.interface';
import { ICoConstraint } from './co-constraint.interface';

export interface ICoConstraintCollection {
  id?: string;
  coconstraintMode: CoConstraintMode;
  baseSegment: string;
  headers: ICoConstraintHeaders;
  coconstraints: ICoConstraint[];
}

export interface ICoConstraintTable extends ICoConstraintCollection {
  groups: ICoConstraintGroupBinding[];
}

export interface ICoConstraintGroup extends ICoConstraintCollection {
  name: string;
}

export interface ICoConstraintGroupBinding {
  requirement: ICoConstraintRequirement;
  type: CoConstraintGroupBindingType;
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
  type: CoConstraintHeaderType;
  key: string;
}

export interface IDataElementHeader extends ICoConstraintHeader {
  name: string;
  columnType: CoConstraintColumnType;
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
  type: CoConstraintColumnType;
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
  value: string;
  datatypeId: string;
}

export interface ICoConstraintValueCell extends ICoConstraintCell {
  value: string;
}

export interface ICoConstraintVariesCell extends ICoConstraintCell {
  cellType: CoConstraintColumnType;
  cellValue: ICoConstraintCell;
}

export enum CoConstraintColumnType {
  CODE = 'CODE',
  VALUESET = 'VALUESET',
  DATATYPE = 'DATATYPE',
  FLAVOR = 'FLAVOR',
  VARIES = 'VARIES',
  VALUE = 'VALUE',
}

export enum CoConstraintGroupBindingType {
  REF = 'REF',
  CONTAINED = 'CONTAINED',
}

export enum CoConstraintHeaderType {
  DATAELEMENT = 'DATAELEMENT',
  NARRATIVE = 'NARRATIVE',
}

export enum CoConstraintMode {
  GROUP = 'GROUP',
  TABLE = 'TABLE',
}

export interface ICoConstraintRequirement {
  usage: string;
  cardinality: {
    min: number;
    max: string;
  };
}
