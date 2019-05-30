import {Usage} from '../constants/usage.enum';
import {IResourceBinding} from './binding.interface';

export interface IDatatype {
  ext?: string;
  purposeAndUse: string;
  binding?: IResourceBinding;
}

export interface IComponent {
  components: IComponent[];
}

export interface IComplexDatatype {
  components: IComponent[];
}

export enum PredicateType {
  PRESENCE = 'PRESENCE', NOTPRESENCE = 'NOTPRESENCE', EQUAL = 'EQUAL', NOTEQUAL = 'NOTEQUAL',
}

export interface IDateTimePredicate {
  trueUsage?: Usage;
  falseUsage?: Usage;
  predicateType?: PredicateType;
  value?: string;
  target: IDateTimeComponentDefinition;
}

export interface IDateTimeComponentDefinition {
  position?: number;
  name?: string;
  description?: string;
  usage: Usage;
  dateTimePredicate: IDateTimePredicate;
}

export interface IDateTimeConstraints {
  dateTimeComponentDefinitions: IDateTimeComponentDefinition[];
}

export interface IDateTimeDatatype extends IDatatype {
  dateTimeConstraints: IDateTimeConstraints;

}
