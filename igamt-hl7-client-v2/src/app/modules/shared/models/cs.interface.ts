import { Type } from '../constants/type.enum';
import { ConformanceStatementStrength } from './conformance-statements.domain';

export interface IConformanceStatement {
  id?: string;
  locked?: boolean;
  type: ConstraintType;
  identifier: string;
  level?: Type;
  context?: IPath;
  structureId?: string;
  sourceIds?: string[];
  igDocumentId?: string;
  strength?: ConformanceStatementStrength;
}

export interface IAssertionConformanceStatement extends IConformanceStatement {
  assertion: IAssertion;
}

export interface IFreeTextConformanceStatement extends IConformanceStatement {
  freeText: string;
  assertionScript: string;
}

export interface IAssertion {
  mode: AssertionMode;
  description: string;
  script?: string;
}

export interface ISimpleAssertion extends IAssertion {
  id?: string;
  complement: IComplement;
  subject: ISubject;
  verbKey: string;
}

export interface IIfThenAssertion extends IAssertion {
  ifAssertion: IAssertion;
  thenAssertion: IAssertion;
}

export interface INotAssertion extends IAssertion {
  child: IAssertion;
}

export interface ISubContextAssertion extends IAssertion {
  context: ISubContext;
  child: IAssertion;
}

export interface IOperatorAssertion extends IAssertion {
  operator: Operator;
  assertions: IAssertion[];
}

export enum AssertionMode {
  SIMPLE = 'SIMPLE',
  IFTHEN = 'IFTHEN',
  ANDOR = 'ANDOR',
  SUBCONTEXT = 'SUBCONTEXT',
  NOT = 'NOT',
}

export enum ConstraintType {
  FREE = 'FREE',
  ASSERTION = 'ASSERTION',
}

export enum Operator {
  AND = 'AND',
  OR = 'OR',
  XOR = 'XOR',
}

export interface ISubject {
  path: IPath;
  occurenceIdPath: string;
  occurenceLocationStr: string;
  occurenceValue: string;
  occurenceType: string;
}

export interface IComplement {
  complementKey: string;
  path: IPath;
  occurenceIdPath: string;
  occurenceLocationStr: string;
  occurenceValue?: any;
  occurenceType: string;
  value?: string;
  values?: string[];
  descs?: string[];
  codesyses?: string[];
  desc?: string;
  codesys?: string;
}

export interface ISubContext {
  path: IPath;
  occurenceIdPath: string;
  occurenceLocationStr: string;
  occurenceValue?: any;
  occurenceType: string;
  description: string;
}

export interface IPath {
  elementId: string;
  child?: IPath;
  instanceParameter?: string;
}
