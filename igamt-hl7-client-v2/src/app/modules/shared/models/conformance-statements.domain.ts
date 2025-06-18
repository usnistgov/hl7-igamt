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

export enum ConformanceStatementStrength {
  SHALL = 'SHALL',
  SHOULD = 'SHOULD',
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
  NOT_CONTAINS_VALUES = 'notContainListValues',
  NOT_CONTAINS_VALUES_DESC = 'notContainListValuesDesc',
  VALUED = 'valued',
  NOT_VALUED = 'notValued',
  CONTAINS_REGEX = 'regex',
}

export enum ComparativeType {
  IDENTICAL = 'cIdentical',
  EARLIER = 'cEarlier',
  EARLIER_EQUIVALENT = 'cEarlierEquivalent',
  TRUNCATED_EARLIER = 'cTruncatedEarlier',
  TRUNCATED_EARLIER_EQUIVALENT = 'cTruncatedEarlierEquivalent',
  EQUIVALENT = 'cEquivalent',
  TRUNCATED_EQUIVALENT = 'cTruncatedEquivalent',
  EQUIVALENT_LATER = 'cEquivalentLater',
  LATER = 'cLater',
  TRUNCATED_EQUIVALENT_LATER = 'cTruncatedEquivalentLater',
  TRUNCATED_LATER = 'cTruncatedLater',
}

export enum StatementType {
  DECLARATIVE = 'DECLARATIVE',
  COMPARATIVE = 'COMPARATIVE',
}
