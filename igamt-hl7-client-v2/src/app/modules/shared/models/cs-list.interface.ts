import { Type } from '../constants/type.enum';
import { IConformanceStatement } from './cs.interface';

export interface IConformanceStatementsContainerMap {
  [index: string]: IConformanceStatementsContainer;
}

export interface IConformanceStatementList {
  conformanceStatements: IConformanceStatement[];
  availableConformanceStatements: IConformanceStatement[];
  associatedConformanceStatementMap: IConformanceStatementsContainerMap;
}

export interface ICPConformanceStatementList {
  name: string;
  identifier: string;
  messageType: string;
  structId: string;
  conformanceStatements: IConformanceStatement[];
  availableConformanceStatements: IConformanceStatement[];
  associatedConformanceStatementMap: IConformanceStatementsContainerMap;
  associatedSEGConformanceStatementMap: IConformanceStatementsContainerMap;
  associatedDTConformanceStatementMap: IConformanceStatementsContainerMap;
}

export interface IConformanceStatementsContainer {
  conformanceStatements: IConformanceStatement[];
  sourceType: Type;
  key: string;
  label: string;
}
