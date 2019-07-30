export interface ICoConstraintTable {
  id?: string;
  supportGroups: boolean;
  segment: string;
  headers: ICCHeaders;
  content: ICCContent;
}

export interface ICCHeaders {
  selectors: ICCHeader[];
  data: ICCHeader[];
  user: ICCHeader[];
}

export interface ICCContent {
  free?: ICCRow[];
  groups?: ICCGroup[];
}

export interface ICCHeader {
  id: string;
  label: string;
  keep?: boolean;
  template?: string;
  content?: IDataElementHeader;
}

export interface ICCRequirement {
  usage: string;
  cardinality: {
    min: number;
    max: string;
  };
}

export interface ICCGroup {
  data: ICCGroupData;
  content: ICCContent;
}

export interface ICCGroupData {
  name: string;
  requirements: ICCRequirement;
}

export interface ICCRow {
  id: string;
  cells: {
    [header: string]: ICCCell,
  };
  requirements: ICCRequirement;
}

export interface ICCCell {
  type: string;
}

export interface IDataCell extends ICCCell {
  value: string;
}

export interface ICodeCell extends IDataCell {
  value: string;
  location: number[];
}

export interface IVSCell extends ICCCell {
  vs: ICCVSValue[];
}

export interface IVariesCell extends ICCCell {
  value: ICCCell;
}

export interface IDataElementHeader {
  path: string;
  elmType: string;
  type: string;
  coded?: boolean;
  complex?: boolean;
  version?: string;
  varies?: boolean;
}

export class CCSelectorType {
  public static VALUE = 'Value';
  public static VALUESET = 'ValueSet';
  public static CODE = 'Code';
  public static IGNORE = 'Ignore';
}

export class CellTemplate {
  public static DATATYPE = 'Datatype';
  public static FLAVOR = 'Flavor';
  public static TEXTAREA = 'textArea';
  public static VARIES = 'Varies';
}

export interface ICCVSValue {
  bindingIdentifier: string;
  bindingStrength: string;
  bindingLocation: string;
  hl7Version: string;
  name: string;
  scope: string;
}

export enum CCNodeType {
  CC,
  GROUP,
  INDEPENDENT,
}

export type CoConstraintTableArray = Array<{
  type: CCNodeType,
  id: string,
  requirements: ICCRequirement,
  name?: string,
  rows?: CoConstraintTableArray,
  row?: ICCRow,
}>;
