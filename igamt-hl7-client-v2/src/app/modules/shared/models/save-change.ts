export interface IChange {
  location: string;
  propertyType: string;
  propertyValue: any;
  oldPropertyValue: any;
  position: number;
  changeType: ChangeType;
}

export enum ChangeType {
  UPDATE = 'UPDATE',
  ADD = 'ADD',
  DELETE = 'DELETE',
}

export enum PropertyType {
  USAGE = 'USAGE',
  DATATYPE = 'DATATYPE',
  SEGMENTREF = 'SEGMENTREF',
  CARDINALITYMAX = 'CARDINALITYMAX',
  LENGTHMIN = 'LENGTHMIN',
  LENGTHMAX = 'LENGTHMAX',
  CONFLENGTH = 'CONFLENGTH',
  CARDINALITYMIN = 'CARDINALITYMIN',
  PREDEF = 'PREDEF',
  POSTDEF = 'POSTDEF',
  VALUESET = 'VALUESET',
  COMMENT = 'COMMENT',
  DEFINITIONTEXT = 'DEFINITIONTEXT',
  EXT = 'EXT',
  DESCRIPTION = 'DESCRIPTION',
  AUTHORNOTES = 'AUTHORNOTES',
  USAGENOTES = 'USAGENOTES',
}
