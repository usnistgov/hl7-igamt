export interface IPredicate {
  id: string;
  identifier: string;
  type: string;
  trueUsage: string;
  falseUsage: string;
  context: any;
  level: any;
  structureId: string;
  sourceIds: string[];
  igDocumentId: string;
  location: string;
  assertion?: IAssertion;
  freeText?: string;
}

export interface IAssertion {
  description: string;
}
