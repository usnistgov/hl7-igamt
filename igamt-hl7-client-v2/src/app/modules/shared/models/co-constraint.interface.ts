import { IBindingLocationInfo } from '../components/binding-selector/binding-selector.component';
import { ICardinalityRange } from '../components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../constants/type.enum';
import { IValuesetBinding } from './binding.interface';
import { IAssertion, IPath } from './cs.interface';
import { DeltaAction } from './delta';
import { IResource } from './resource.interface';

export interface IStructureElementRef {
  pathId: string;
  name: string;
  type?: Type;
  path: IPath;
}

export interface ICoConstraintBindingContext {
  context: IStructureElementRef;
  bindings: ICoConstraintBindingSegment[];
  delta?: DeltaAction;
}

export interface ICoConstraintBindingSegment {
  segment: IStructureElementRef;
  flavorId: string;
  name: string;
  tables: ICoConstraintTableConditionalBinding[];
  delta?: DeltaAction;
}

export interface ICoConstraintTableConditionalBinding {
  condition: IAssertion;
  value: ICoConstraintTable;
  delta?: DeltaAction;
}

export interface ICoConstraintTable {
  id?: string;
  tableType: CoConstraintMode;
  baseSegment: string;
  headers: ICoConstraintHeaders;
  coConstraints: ICoConstraint[];
  groups: ICoConstraintGroupBinding[];
  delta?: DeltaAction;
}

export interface ICoConstraintGroup extends IResource {
  id: string;
  baseSegment: string;
  headers: ICoConstraintHeaders;
  coConstraints: ICoConstraint[];
  name: string;
}

export interface ICoConstraintGroupBinding {
  id: string;
  requirement: ICoConstraintRequirement;
  type: CoConstraintGroupBindingType;
  delta?: DeltaAction;
}

export interface ICoConstraintGroupBindingRef extends ICoConstraintGroupBinding {
  refId: string;
}

export interface ICoConstraintGroupBindingContained extends ICoConstraintGroupBinding {
  name: string;
  coConstraints: ICoConstraint[];
}

export interface ICoConstraintHeaders {
  selectors: ICoConstraintHeader[];
  constraints: ICoConstraintHeader[];
  narratives: ICoConstraintHeader[];
}

export interface ICoConstraintHeader {
  type: CoConstraintHeaderType;
  key: string;
  _keep?: boolean;
}

export interface IDataElementHeader extends ICoConstraintHeader {
  name: string;
  cardinality: boolean;
  columnType: CoConstraintColumnType;
  elementInfo: IDataElementHeaderInfo;
}

export interface IDataElementHeaderInfo {
  version: string;
  parent: string;
  datatype: string;
  location: number;
  cardinality: ICardinalityRange;
  type: Type;
  bindingInfo: IBindingLocationInfo;
}

export interface INarrativeHeader extends ICoConstraintHeader {
  title: string;
}

export interface ICoConstraint {
  id: string;
  requirement: ICoConstraintRequirement;
  cloned?: boolean;
  cells: ICoConstraintCells;
  delta?: DeltaAction;
}

export interface ICoConstraintCells {
  [key: string]: ICoConstraintCell;
}

export interface ICoConstraintCell {
  type: CoConstraintColumnType;
  cardinalityMax?: string;
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
