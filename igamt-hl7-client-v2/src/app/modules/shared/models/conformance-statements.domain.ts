import { IHL7v2TreeNode } from '../components/hl7-v2-tree/hl7-v2-tree.component';
export interface IStatement {
  target?: {
    name: string,
    node: IHL7v2TreeNode,
    path: any,
    repeatMax: number,
  };
  compareTo?: {
    name: string,
    node: IHL7v2TreeNode,
    path: any,
    repeatMax: number,
  };
  complement?: any;
  occurence?: string;
  occurenceNumber?: number;
  verb?: string;
  statementType: StatementType;
  statement?: DeclarativeType | ComparativeType;
}

export enum OccurrenceType {
  AT_LEAST_ONE = 'atLeast',
  INSTANCE = 'instance',
  NONE = 'noOccurrence',
  ONE = 'exactlyOne',
  COUNT = 'count',
  ALL = 'all',
}

export enum VerbType {
  SHALL = 'SHALL',
  SHALL_NOT = 'SHALL NOT',
  SHOULD = 'SHOULD',
  SHOULD_NOT = 'SHOULD NOT',
  MAY = 'MAY',
  MAY_NOT = 'MAY NOT',
}

export enum DeclarativeType {
  CONTAINS_VALUE = 'containValue',
  CONTAINS_VALUE_DESC = 'containValueDesc',
  CONTAINS_CODE = 'containCode',
  CONTAINS_CODE_DESC = 'containCodeDesc',
  CONTAINS_VALUES = 'containListValues',
  CONTAINS_CODES = 'containListCodes',
  CONTAINS_REGEX = 'regex',
  CONTAINS_VALUES_DESC = 'containListValuesDesc',
  CONTAINS_CODES_DESC = 'containListCodesDesc',
  INTEGER = 'positiveInteger',
  SEQUENCE = 'sequentially',
  ISO = 'iso',
}

export enum PropositionType {
  CONTAINS_VALUE = 'containValue',
  NOT_CONTAINS_VALUE = 'notContainValue',
  CONTAINS_VALUE_DESC = 'containValueDesc',
  NOT_CONTAINS_VALUE_DESC = 'notContainValueDesc',
  CONTAINS_VALUES = 'containListValues',
  CONTAINS_VALUES_DESC = 'containListValuesDesc',
  NOT_CONTAINS_VALUES = 'notContainValues',
  NOT_CONTAINS_VALUES_DESC = 'notContainValuesDesc',
  VALUED = 'valued',
  NOT_VALUED = 'notValued',
}

export enum ComparativeType {
  IDENTICAL = 'c-identical',
  EARLIER = 'c-earlier',
  EARLIER_EQUIVALENT = 'c-earlier-equivalent',
  TRUNCATED_EARLIER = 'c-truncated-earlier',
  TRUNCATED_EARLIER_EQUIVALENT = 'c-truncated-earlier-equivalent',
  EQUIVALENT = 'c-equivalent',
  TRUNCATED_EQUIVALENT = 'c-truncated-equivalent',
  EQUIVALENT_LATER = 'c-equivalent-later',
  LATER = 'c-later',
  TRUNCATED_EQUIVALENT_LATER = 'c-truncated-equivalent-later',
  TRUNCATED_LATER = 'c-truncated-later',
}

export enum StatementType {
  DECLARATIVE = 'DECLARATIVE',
  COMPARATIVE = 'COMPARATIVE',
}

export enum ConformanceStatementType {
  STATEMENT = 'STATEMENT',
  PROPOSITION = 'PROPOSITION',
}
