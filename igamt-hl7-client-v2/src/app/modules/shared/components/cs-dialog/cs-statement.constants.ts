import { ComparativeType, DeclarativeType, OccurrenceType, PropositionType, VerbType } from "../../models/conformance-statements.domain";

export const OCCURRENCES = [
  { label: 'At least one occurrence of', value: OccurrenceType.AT_LEAST_ONE },
  { label: 'The \'INSTANCE\' occurrence of', value: OccurrenceType.INSTANCE },
  { label: 'No occurrence of', value: OccurrenceType.NONE },
  { label: 'Exactly one occurrence of', value: OccurrenceType.ONE },
  { label: '\'COUNT\' occurrences of', value: OccurrenceType.COUNT },
  { label: 'All occurrences of', value: OccurrenceType.ALL },
];

export const VERBS = [
  { label: 'SHALL', value: VerbType.SHALL },
  { label: 'SHALL NOT', value: VerbType.SHALL_NOT },
  { label: 'SHOULD', value: VerbType.SHOULD },
  { label: 'SHOULD NOT', value: VerbType.SHOULD_NOT },
  { label: 'MAY', value: VerbType.MAY },
  // { label: 'MAY NOT', value: VerbType.MAY_NOT },
];

export const DECLARATIVES = [
  { label: 'contain the value \'VALUE\'.', value: DeclarativeType.CONTAINS_VALUE },
  { label: 'contain the value \'VALUE\' (DESCRIPTION).', value: DeclarativeType.CONTAINS_VALUE_DESC },
  { label: 'contain the value \‘VALUE\’ (DESCRIPTION) drawn from the code system \'CODE SYSTEM\'.', value: DeclarativeType.CONTAINS_CODE_DESC },
  { label: 'contain the value \'VALUE\' drawn from the code system \'CODE SYSTEM\'.', value: DeclarativeType.CONTAINS_CODE },
  { label: 'contain one of the values in the list: { \'VALUE 1\', \'VALUE 2\', \'VALUE N\' }.', value: DeclarativeType.CONTAINS_VALUES },
  { label: 'contain one of the values in the list: { \‘VALUE 1\’ (DESCRIPTION), \'VALUE 2\' (DESCRIPTION), \'VALUE N\' (DESCRIPTION) }.', value: DeclarativeType.CONTAINS_VALUES_DESC },
  { label: 'contain one of the values in the list: { \'VALUE 1\', \'VALUE 2\', \'VALUE N\' } drawn from the code system \'CODE SYSTEM\'.', value: DeclarativeType.CONTAINS_CODES },
  { label: 'contain one of the values in the list: { \‘VALUE 1\’ (DESCRIPTION), \'VALUE 2\' (DESCRIPTION), \'VALUE N\' (DESCRIPTION) } drawn from the code system \'CODE SYSTEM\'.', value: DeclarativeType.CONTAINS_CODES_DESC },
  { label: 'match the regular expression \'REGULAR EXPRESSION\'.', value: DeclarativeType.CONTAINS_REGEX },
  { label: 'contain a positive integer.', value: DeclarativeType.INTEGER },
  { label: 'be valued sequentially starting with the value \'1\'.', value: DeclarativeType.SEQUENCE },
  { label: 'be valued with an ISO-compliant OID.', value: DeclarativeType.ISO },
];

export const COMPARATIVES = [
  { label: 'be identical to', value: ComparativeType.IDENTICAL },
  { label: 'be earlier than', value: ComparativeType.EARLIER },
  { label: 'be earlier than or equivalent to', value: ComparativeType.EARLIER_EQUIVALENT },
  { label: 'be truncated earlier than', value: ComparativeType.TRUNCATED_EARLIER },
  { label: 'be truncated earlier than or truncated equivalent to', value: ComparativeType.TRUNCATED_EARLIER_EQUIVALENT },
  { label: 'be equivalent to', value: ComparativeType.EQUIVALENT },
  { label: 'be truncated equivalent to', value: ComparativeType.TRUNCATED_EQUIVALENT },
  { label: 'be equivalent to or later than', value: ComparativeType.EQUIVALENT_LATER },
  { label: 'be later than', value: ComparativeType.LATER },
  { label: 'be truncated equivalent to or truncated later than', value: ComparativeType.TRUNCATED_EQUIVALENT_LATER },
  { label: 'be truncated later than', value: ComparativeType.TRUNCATED_LATER },
];

export const PROPOSITIONS = [
  { label: 'is valued', value: PropositionType.VALUED },
  { label: 'is not valued', value: PropositionType.NOT_VALUED },
  { label: 'contains the value \'VALUE\'.', value: PropositionType.CONTAINS_VALUE },
  { label: 'does not contain the value \'VALUE\'.', value: PropositionType.NOT_CONTAINS_VALUE },
  { label: 'contains the value \'VALUE\' (DESCRIPTION).', value: PropositionType.CONTAINS_VALUE_DESC },
  { label: 'does not contain the value \'VALUE\' (DESCRIPTION).', value: PropositionType.NOT_CONTAINS_VALUE_DESC },
  { label: 'contains one of the values in the list: { \'VALUE 1\', \'VALUE 2\', \'VALUE N\' }.', value: PropositionType.CONTAINS_VALUES },
  { label: 'contains one of the values in the list: { \‘VALUE 1\’ (DESCRIPTION), \'VALUE 2\' (DESCRIPTION), \'VALUE N\' (DESCRIPTION) }.', value: PropositionType.CONTAINS_VALUES_DESC },
  { label: 'does not contain one of the values in the list: { \'VALUE 1\', \'VALUE 2\', \'VALUE N\' }.', value: PropositionType.NOT_CONTAINS_VALUES },
  { label: 'does not contain one of the values in the list: { \‘VALUE 1\’ (DESCRIPTION), \'VALUE 2\' (DESCRIPTION), \'VALUE N\' (DESCRIPTION) }.', value: PropositionType.NOT_CONTAINS_VALUES_DESC },
];
